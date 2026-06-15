package routes

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/company-website/server/src/interfaces"
	"github.com/skygenesisenterprise/company-website/server/src/middleware"
	"github.com/skygenesisenterprise/company-website/server/src/models"
	"github.com/skygenesisenterprise/company-website/server/src/services"
)

// SetupRoutes configure toutes les routes API.
// C'est le point d'entrée principal pour la configuration des routes.
func SetupRoutes(router *gin.Engine, systemKey string, serviceKeyService *services.ServiceKeyService, dbService interfaces.IDatabaseService) {
	_ = serviceKeyService
	_ = dbService

	router.Use(middleware.RequestIDMiddleware())
	router.Use(middleware.ContextMiddleware())

	siteHandler := NewSiteHandler(systemKey)
	statusHandler := NewStatusHandler(siteHandler)

	api := router.Group("/api/v1")
	{
		// ==================== HEALTH ====================
		api.GET("/health", siteHandler.Health)

		// ==================== PUBLIC ====================
		public := api.Group("/public")
		{
			public.POST("/contact", siteHandler.PublicContact)
			public.POST("/newsletter/subscribe", siteHandler.PublicNewsletterSubscribe)
			public.POST("/newsletter/unsubscribe", siteHandler.PublicNewsletterUnsubscribe)
			public.GET("/status", statusHandler.PublicStatus)
			public.GET("/pages/:slug", siteHandler.PublicPageBySlug)
		}

		// ==================== CMS ====================
		siteHandler.RegisterResource(api.Group("/categories"), "categories")
		siteHandler.RegisterResource(api.Group("/medias"), "medias")
		siteHandler.RegisterResource(api.Group("/dossiers"), "dossiers")

		pages := api.Group("/pages")
		{
			siteHandler.RegisterResource(pages, "pages")
			pages.POST("/:id/publish", siteHandler.RequireAdmin(), siteHandler.SetStatus("pages", "published"))
			pages.POST("/:id/unpublish", siteHandler.RequireAdmin(), siteHandler.SetStatus("pages", "draft"))
			pages.POST("/:id/archive", siteHandler.RequireAdmin(), siteHandler.SetStatus("pages", "archived"))
			pages.POST("/:id/restore", siteHandler.RequireAdmin(), siteHandler.SetStatus("pages", "draft"))
		}

		// ==================== OPERATIONS & INTEGRATIONS ====================
		siteHandler.RegisterResource(api.Group("/services"), "services")

		status := api.Group("/status")
		{
			status.GET("", statusHandler.ListStatus)
			status.POST("", siteHandler.RequireAdmin(), statusHandler.CreateStatus)
			status.GET("/current", statusHandler.GetCurrentStatus)

			status.POST("/incidents", siteHandler.RequireAdmin(), statusHandler.CreateIncident)
			status.PATCH("/incidents/:id", siteHandler.RequireAdmin(), statusHandler.UpdateIncident)
			status.POST("/incidents/:id/resolve", siteHandler.RequireAdmin(), statusHandler.ResolveIncident)

			status.POST("/maintenance", siteHandler.RequireAdmin(), statusHandler.CreateMaintenance)
			status.PATCH("/maintenance/:id", siteHandler.RequireAdmin(), statusHandler.UpdateMaintenance)
			status.POST("/maintenance/:id/cancel", siteHandler.RequireAdmin(), statusHandler.CancelMaintenance)
		}

		apiKeys := api.Group("/api-keys")
		{
			siteHandler.RegisterResource(apiKeys, "api-keys")
			apiKeys.POST("/:id/revoke", siteHandler.RequireAdmin(), siteHandler.SetStatus("api-keys", "revoked"))
			apiKeys.POST("/:id/rotate", siteHandler.RequireAdmin(), siteHandler.RotateAPIKey)
		}

		webhooks := api.Group("/webhooks")
		{
			siteHandler.RegisterResource(webhooks, "webhooks")
			webhooks.POST("/:id/test", siteHandler.RequireAdmin(), siteHandler.TestWebhook)
			webhooks.POST("/:id/enable", siteHandler.RequireAdmin(), siteHandler.SetStatus("webhooks", "active"))
			webhooks.POST("/:id/disable", siteHandler.RequireAdmin(), siteHandler.SetStatus("webhooks", "disabled"))
		}

		linker := api.Group("/linker")
		{
			siteHandler.RegisterResource(linker, "linker")
			linker.POST("/:id/enable", siteHandler.RequireAdmin(), siteHandler.SetStatus("linker", "active"))
			linker.POST("/:id/disable", siteHandler.RequireAdmin(), siteHandler.SetStatus("linker", "disabled"))
		}

		// ==================== AUDIENCE & USERS ====================
		comments := api.Group("/comments")
		{
			siteHandler.RegisterResource(comments, "comments")
			comments.POST("/:id/approve", siteHandler.RequireAdmin(), siteHandler.SetStatus("comments", "approved"))
			comments.POST("/:id/reject", siteHandler.RequireAdmin(), siteHandler.SetStatus("comments", "rejected"))
			comments.POST("/:id/spam", siteHandler.RequireAdmin(), siteHandler.SetStatus("comments", "spam"))
			comments.POST("/:id/restore", siteHandler.RequireAdmin(), siteHandler.SetStatus("comments", "pending"))
		}

		newsletter := api.Group("/newsletter")
		{
			siteHandler.RegisterResource(newsletter, "newsletter")
			newsletter.POST("/:id/unsubscribe", siteHandler.RequireAdmin(), siteHandler.SetStatus("newsletter", "unsubscribed"))
			newsletter.POST("/:id/resubscribe", siteHandler.RequireAdmin(), siteHandler.SetStatus("newsletter", "active"))
		}

		siteHandler.RegisterResource(api.Group("/subscriptions"), "subscriptions")

		users := api.Group("/users")
		{
			siteHandler.RegisterResource(users, "users")
			users.POST("/:id/suspend", siteHandler.RequireAdmin(), siteHandler.SetStatus("users", "suspended"))
			users.POST("/:id/reactivate", siteHandler.RequireAdmin(), siteHandler.SetStatus("users", "active"))
			users.PATCH("/:id/role", siteHandler.RequireAdmin(), siteHandler.UpdateUserRole)
		}

		// ==================== MONITORING & GOVERNANCE ====================
		siteHandler.RegisterResource(api.Group("/analytics"), "analytics")
		siteHandler.RegisterResource(api.Group("/audit-logs"), "audit-logs")

		notifications := api.Group("/notifications")
		{
			siteHandler.RegisterResource(notifications, "notifications")
			notifications.POST("/:id/read", siteHandler.RequireAdmin(), siteHandler.SetStatus("notifications", "read"))
			notifications.POST("/:id/archive", siteHandler.RequireAdmin(), siteHandler.SetStatus("notifications", "archived"))
			notifications.POST("/:id/send", siteHandler.RequireAdmin(), siteHandler.SetStatus("notifications", "sent"))
		}

		scheduling := api.Group("/scheduling")
		{
			siteHandler.RegisterResource(scheduling, "scheduling")
			scheduling.POST("/:id/cancel", siteHandler.RequireAdmin(), siteHandler.SetStatus("scheduling", "canceled"))
			scheduling.POST("/:id/run-now", siteHandler.RequireAdmin(), siteHandler.RunScheduleNow)
		}

		// ==================== SETTINGS ====================
		siteHandler.RegisterResource(api.Group("/settings"), "settings")
	}
}

// ==================== SITE HANDLERS ====================

type SiteHandler struct {
	store     *services.SiteAPIService
	systemKey string
}

func NewSiteHandler(systemKey string) *SiteHandler {
	store := services.NewSiteAPIService()
	store.SeedStatus()

	return &SiteHandler{
		store:     store,
		systemKey: systemKey,
	}
}

func (h *SiteHandler) RegisterResource(group *gin.RouterGroup, resource string) {
	group.GET("", h.List(resource))
	group.POST("", h.RequireAdmin(), h.Create(resource))
	group.GET("/:id", h.Get(resource))
	group.PATCH("/:id", h.RequireAdmin(), h.Update(resource))
	group.DELETE("/:id", h.RequireAdmin(), h.Delete(resource))
}

func (h *SiteHandler) Health(c *gin.Context) {
	Success(c, http.StatusOK, gin.H{"status": "ok"})
}

func (h *SiteHandler) List(resource string) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := listQuery(c)
		rows, total := h.store.List(resource, query)
		ListSuccess(c, rows, query.Page, query.PageSize, total)
	}
}

func (h *SiteHandler) Create(resource string) gin.HandlerFunc {
	return func(c *gin.Context) {
		input, ok := bindResourceInput(c)
		if !ok {
			return
		}
		Success(c, http.StatusCreated, h.store.Create(resource, input))
	}
}

func (h *SiteHandler) Get(resource string) gin.HandlerFunc {
	return func(c *gin.Context) {
		item, ok := h.store.Get(resource, c.Param("id"))
		if !ok {
			Error(c, http.StatusNotFound, "NOT_FOUND", "Resource not found", nil)
			return
		}
		Success(c, http.StatusOK, item)
	}
}

func (h *SiteHandler) Update(resource string) gin.HandlerFunc {
	return func(c *gin.Context) {
		input, ok := bindResourceInput(c)
		if !ok {
			return
		}
		item, found := h.store.Update(resource, c.Param("id"), input)
		if !found {
			Error(c, http.StatusNotFound, "NOT_FOUND", "Resource not found", nil)
			return
		}
		Success(c, http.StatusOK, item)
	}
}

func (h *SiteHandler) Delete(resource string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !h.store.Delete(resource, c.Param("id")) {
			Error(c, http.StatusNotFound, "NOT_FOUND", "Resource not found", nil)
			return
		}
		Success(c, http.StatusOK, gin.H{"deleted": true})
	}
}

func (h *SiteHandler) SetStatus(resource, status string) gin.HandlerFunc {
	return func(c *gin.Context) {
		item, ok := h.store.SetStatus(resource, c.Param("id"), status)
		if !ok {
			Error(c, http.StatusNotFound, "NOT_FOUND", "Resource not found", nil)
			return
		}
		Success(c, http.StatusOK, item)
	}
}

func (h *SiteHandler) RotateAPIKey(c *gin.Context) {
	item, ok := h.store.RotateAPIKey(c.Param("id"))
	if !ok {
		Error(c, http.StatusNotFound, "NOT_FOUND", "API key not found", nil)
		return
	}
	Success(c, http.StatusOK, item)
}

func (h *SiteHandler) TestWebhook(c *gin.Context) {
	if _, ok := h.store.Get("webhooks", c.Param("id")); !ok {
		Error(c, http.StatusNotFound, "NOT_FOUND", "Webhook not found", nil)
		return
	}
	Success(c, http.StatusOK, gin.H{"delivered": true, "status": "queued"})
}

func (h *SiteHandler) RunScheduleNow(c *gin.Context) {
	item, ok := h.store.SetStatus("scheduling", c.Param("id"), "running")
	if !ok {
		Error(c, http.StatusNotFound, "NOT_FOUND", "Schedule not found", nil)
		return
	}
	Success(c, http.StatusOK, gin.H{"job": item, "run": "queued"})
}

func (h *SiteHandler) UpdateUserRole(c *gin.Context) {
	var input models.SiteResourceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		Error(c, http.StatusBadRequest, "INVALID_PAYLOAD", "Invalid JSON payload", nil)
		return
	}
	if strings.TrimSpace(input.Role) == "" {
		Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Role is required", gin.H{"field": "role"})
		return
	}

	item, ok := h.store.Update("users", c.Param("id"), input)
	if !ok {
		Error(c, http.StatusNotFound, "NOT_FOUND", "User not found", nil)
		return
	}
	Success(c, http.StatusOK, item)
}

func (h *SiteHandler) PublicContact(c *gin.Context) {
	input, ok := bindResourceInput(c)
	if !ok {
		return
	}
	if input.Email == "" {
		Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Email is required", gin.H{"field": "email"})
		return
	}
	Success(c, http.StatusCreated, h.store.Create("contact", input))
}

func (h *SiteHandler) PublicNewsletterSubscribe(c *gin.Context) {
	input, ok := bindResourceInput(c)
	if !ok {
		return
	}
	if input.Email == "" {
		Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Email is required", gin.H{"field": "email"})
		return
	}
	input.Status = "active"
	Success(c, http.StatusCreated, h.store.Create("subscriptions", input))
}

func (h *SiteHandler) PublicNewsletterUnsubscribe(c *gin.Context) {
	input, ok := bindResourceInput(c)
	if !ok {
		return
	}
	if input.Email == "" {
		Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Email is required", gin.H{"field": "email"})
		return
	}
	input.Status = "unsubscribed"
	Success(c, http.StatusCreated, h.store.Create("subscriptions", input))
}

func (h *SiteHandler) PublicPageBySlug(c *gin.Context) {
	item, ok := h.store.GetBySlug("pages", c.Param("slug"))
	if !ok {
		Error(c, http.StatusNotFound, "NOT_FOUND", "Page not found", nil)
		return
	}
	Success(c, http.StatusOK, item)
}

func (h *SiteHandler) RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		if h.systemKey == "" {
			c.Next()
			return
		}

		key := c.GetHeader("X-System-Key")
		if key == "" {
			auth := c.GetHeader("Authorization")
			if strings.HasPrefix(auth, "Bearer ") {
				key = strings.TrimPrefix(auth, "Bearer ")
			}
		}

		if key != h.systemKey {
			Error(c, http.StatusUnauthorized, "UNAUTHORIZED", "System key required", nil)
			c.Abort()
			return
		}

		c.Next()
	}
}

// ==================== STATUS HANDLERS ====================

type StatusHandler struct {
	site *SiteHandler
}

func NewStatusHandler(site *SiteHandler) *StatusHandler {
	return &StatusHandler{site: site}
}

func (h *StatusHandler) ListStatus(c *gin.Context) {
	query := listQuery(c)
	rows, total := h.site.store.List("status", query)
	ListSuccess(c, rows, query.Page, query.PageSize, total)
}

func (h *StatusHandler) CreateStatus(c *gin.Context) {
	input, ok := bindResourceInput(c)
	if !ok {
		return
	}
	Success(c, http.StatusCreated, h.site.store.Create("status", input))
}

func (h *StatusHandler) GetCurrentStatus(c *gin.Context) {
	h.PublicStatus(c)
}

func (h *StatusHandler) PublicStatus(c *gin.Context) {
	item, ok := h.site.store.Get("status", "current")
	if !ok {
		Error(c, http.StatusNotFound, "NOT_FOUND", "Status not found", nil)
		return
	}
	Success(c, http.StatusOK, item)
}

func (h *StatusHandler) CreateIncident(c *gin.Context) {
	h.createStatusChild(c, "status-incidents")
}

func (h *StatusHandler) UpdateIncident(c *gin.Context) {
	h.updateStatusChild(c, "status-incidents")
}

func (h *StatusHandler) ResolveIncident(c *gin.Context) {
	h.setStatusChild(c, "status-incidents", "resolved")
}

func (h *StatusHandler) CreateMaintenance(c *gin.Context) {
	h.createStatusChild(c, "status-maintenance")
}

func (h *StatusHandler) UpdateMaintenance(c *gin.Context) {
	h.updateStatusChild(c, "status-maintenance")
}

func (h *StatusHandler) CancelMaintenance(c *gin.Context) {
	h.setStatusChild(c, "status-maintenance", "canceled")
}

func (h *StatusHandler) createStatusChild(c *gin.Context, resource string) {
	input, ok := bindResourceInput(c)
	if !ok {
		return
	}
	Success(c, http.StatusCreated, h.site.store.Create(resource, input))
}

func (h *StatusHandler) updateStatusChild(c *gin.Context, resource string) {
	input, ok := bindResourceInput(c)
	if !ok {
		return
	}
	item, found := h.site.store.Update(resource, c.Param("id"), input)
	if !found {
		Error(c, http.StatusNotFound, "NOT_FOUND", "Status item not found", nil)
		return
	}
	Success(c, http.StatusOK, item)
}

func (h *StatusHandler) setStatusChild(c *gin.Context, resource string, status string) {
	item, found := h.site.store.SetStatus(resource, c.Param("id"), status)
	if !found {
		Error(c, http.StatusNotFound, "NOT_FOUND", "Status item not found", nil)
		return
	}
	Success(c, http.StatusOK, item)
}

// ==================== RESPONSE HELPERS ====================

func Success(c *gin.Context, status int, data interface{}) {
	c.JSON(status, models.APIEnvelope{
		Success: true,
		Data:    data,
		Meta:    meta(c),
	})
}

func ListSuccess(c *gin.Context, data interface{}, page int, pageSize int, total int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}

	totalPages := 0
	if total > 0 {
		totalPages = (total + pageSize - 1) / pageSize
	}

	c.JSON(http.StatusOK, models.APIEnvelope{
		Success: true,
		Data:    data,
		Pagination: &models.Pagination{
			Page:       page,
			PageSize:   pageSize,
			Total:      total,
			TotalPages: totalPages,
		},
		Meta: meta(c),
	})
}

func Error(c *gin.Context, status int, code string, message string, details interface{}) {
	c.JSON(status, models.APIEnvelope{
		Success: false,
		Error: &models.APIError{
			Code:    code,
			Message: message,
			Details: details,
		},
		Meta: meta(c),
	})
}

func meta(c *gin.Context) models.APIMeta {
	return models.APIMeta{
		RequestID: c.GetString("request_id"),
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
}

// ==================== REQUEST HELPERS ====================

func bindResourceInput(c *gin.Context) (models.SiteResourceInput, bool) {
	var input models.SiteResourceInput
	if c.Request.Body == nil {
		return input, true
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		Error(c, http.StatusBadRequest, "INVALID_PAYLOAD", "Invalid JSON payload", nil)
		return input, false
	}

	input.Email = strings.TrimSpace(input.Email)
	if input.Email != "" && !strings.Contains(input.Email, "@") {
		Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid email", gin.H{"field": "email"})
		return input, false
	}

	return input, true
}

func listQuery(c *gin.Context) models.ListQuery {
	page := queryInt(c, "page", 1)
	pageSize := queryInt(c, "pageSize", 20)
	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}

	return models.ListQuery{
		Page:     page,
		PageSize: pageSize,
		Search:   strings.TrimSpace(c.Query("search")),
		Status:   strings.TrimSpace(c.Query("status")),
		Sort:     strings.TrimSpace(c.Query("sort")),
		Order:    strings.TrimSpace(c.Query("order")),
		From:     strings.TrimSpace(c.Query("from")),
		To:       strings.TrimSpace(c.Query("to")),
	}
}

func queryInt(c *gin.Context, key string, fallback int) int {
	value := c.Query(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}
	return parsed
}
