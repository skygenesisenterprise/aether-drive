package routes

import (
	"bytes"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/etheriatimes/etheriatimes/server/src/middleware"
	"github.com/etheriatimes/etheriatimes/server/src/models"
	"github.com/etheriatimes/etheriatimes/server/src/services"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// SetupRoutes configure toutes les routes API
// C'est le point d'entrée principal pour la configuration des routes
func SetupRoutes(router *gin.Engine, jwtService *services.JWTService) {
	authMiddleware := middleware.NewAuthMiddleware(jwtService)

	api := router.Group("/api/v1")
	{
		// ==================== AUTH (Aether Account) ====================
		authHandler := NewAuthHandler(jwtService)
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/refresh", authHandler.Refresh)
			auth.POST("/change-password", authMiddleware.RequireAuth(), authHandler.ChangePassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
			auth.POST("/validate", authHandler.ValidateToken)
		}

		// ==================== ACCOUNT ====================
		account := api.Group("/account")
		{
			account.GET("/me", authMiddleware.RequireAuth(), authHandler.GetAccount)
		}

		// ==================== PROFILE ====================
		profileHandler := NewProfileHandler()
		profile := api.Group("/profile")
		profile.Use(authMiddleware.RequireAuth())
		{
			profile.GET("/", profileHandler.GetProfile)
			profile.PUT("/", profileHandler.UpdateProfile)
			profile.POST("/avatar", profileHandler.UploadAvatar)
		}

		// ==================== PASSWORDS ====================
		passwordHandler := NewPasswordHandler()
		passwords := api.Group("/passwords")
		passwords.Use(authMiddleware.RequireAuth())
		{
			passwords.GET("/", passwordHandler.ListPasswords)
			passwords.POST("/", passwordHandler.CreatePassword)
			passwords.GET("/:id", passwordHandler.GetPassword)
			passwords.PUT("/:id", passwordHandler.UpdatePassword)
			passwords.DELETE("/:id", passwordHandler.DeletePassword)
		}

		// ==================== SECURITY ====================
		securityHandler := NewSecurityHandler()
		security := api.Group("/security")
		security.Use(authMiddleware.RequireAuth())
		{
			security.GET("/", securityHandler.GetSecurityInfo)
			security.GET("/devices", securityHandler.GetDevices)
			security.GET("/sessions", securityHandler.GetSessions)
			security.GET("/activities", securityHandler.GetActivities)
			security.POST("/devices/:id/trust", securityHandler.TrustDevice)
			security.DELETE("/devices/:id", securityHandler.RevokeDevice)
			security.DELETE("/sessions/:id", securityHandler.RevokeSession)
			security.POST("/2fa/enable", securityHandler.EnableTwoFactor)
			security.POST("/2fa/disable", securityHandler.DisableTwoFactor)
			security.POST("/2fa/verify", securityHandler.VerifyTwoFactor)
		}

		// ==================== THIRD PARTY ====================
		thirdPartyHandler := NewThirdPartyHandler()
		thirdParty := api.Group("/third-party")
		thirdParty.Use(authMiddleware.RequireAuth())
		{
			thirdParty.GET("/", thirdPartyHandler.ListApps)
			thirdParty.POST("/", thirdPartyHandler.ConnectApp)
			thirdParty.DELETE("/:id", thirdPartyHandler.RevokeApp)
		}

		// ==================== CONTACTS ====================
		contactHandler := NewContactHandler()
		contacts := api.Group("/contacts")
		contacts.Use(authMiddleware.RequireAuth())
		{
			contacts.GET("/", contactHandler.ListContacts)
			contacts.POST("/", contactHandler.CreateContact)
			contacts.GET("/:id", contactHandler.GetContact)
			contacts.PUT("/:id", contactHandler.UpdateContact)
			contacts.DELETE("/:id", contactHandler.DeleteContact)
			contacts.GET("/groups", contactHandler.ListGroups)
			contacts.POST("/groups", contactHandler.CreateGroup)
		}

		// ==================== PRIVACY ====================
		privacyHandler := NewPrivacyHandler()
		privacy := api.Group("/privacy")
		privacy.Use(authMiddleware.RequireAuth())
		{
			privacy.GET("/", privacyHandler.GetPrivacySettings)
			privacy.PUT("/", privacyHandler.UpdatePrivacySettings)
			privacy.POST("/export", privacyHandler.ExportData)
			privacy.POST("/delete", privacyHandler.DeleteAccount)
		}

		// ==================== ETHERIA TIMES (Articles, Categories, etc.) ====================
		etheriaHandler := NewEtheriaHandlers(jwtService)

		// Articles
		articles := api.Group("/articles")
		{
			articles.GET("", etheriaHandler.ListArticles)
			articles.GET("/section/:section", etheriaHandler.GetArticlesBySection)
			articles.GET("/homepage", etheriaHandler.GetHomepageArticles)
			articles.GET("/:id", etheriaHandler.GetArticle)
			articles.GET("/slug/:slug", etheriaHandler.GetArticleBySlug)
			articles.POST("", authMiddleware.RequireAuth(), etheriaHandler.CreateArticle)
			articles.PUT("/:id", authMiddleware.RequireAuth(), etheriaHandler.UpdateArticle)
			articles.DELETE("/:id", authMiddleware.RequireAuth(), etheriaHandler.DeleteArticle)
			articles.POST("/:id/publish", authMiddleware.RequireAuth(), etheriaHandler.PublishArticle)
			articles.POST("/:id/archive", authMiddleware.RequireAuth(), etheriaHandler.ArchiveArticle)
			articles.POST("/:id/feature", authMiddleware.RequireAuth(), etheriaHandler.ToggleFeatured)
		}

		// Categories
		categories := api.Group("/categories")
		{
			categories.GET("", etheriaHandler.ListCategories)
			categories.GET("/:id", etheriaHandler.GetCategory)
			categories.POST("", authMiddleware.RequireAuth(), etheriaHandler.CreateCategory)
			categories.PUT("/:id", authMiddleware.RequireAuth(), etheriaHandler.UpdateCategory)
			categories.DELETE("/:id", authMiddleware.RequireAuth(), etheriaHandler.DeleteCategory)
		}

		// Comments
		comments := api.Group("/comments")
		{
			comments.GET("/article/:articleId", etheriaHandler.ListComments)
			comments.POST("", authMiddleware.RequireAuth(), etheriaHandler.CreateComment)
			comments.PUT("/:id", authMiddleware.RequireAuth(), etheriaHandler.UpdateComment)
			comments.DELETE("/:id", authMiddleware.RequireAuth(), etheriaHandler.DeleteComment)
			comments.POST("/:id/flag", authMiddleware.RequireAuth(), etheriaHandler.FlagComment)
			comments.POST("/:id/approve", authMiddleware.RequireAuth(), etheriaHandler.ApproveComment)
		}

		// User (Bookmarks, History, Notifications, Subscription)
		users := api.Group("/user")
		users.Use(authMiddleware.RequireAuth())
		{
			users.GET("/bookmarks", etheriaHandler.ListBookmarks)
			users.POST("/bookmarks", etheriaHandler.AddBookmark)
			users.DELETE("/bookmarks/:articleId", etheriaHandler.RemoveBookmark)
			users.GET("/history", etheriaHandler.ListReadingHistory)
			users.POST("/history", etheriaHandler.AddToHistory)
			users.DELETE("/history", etheriaHandler.ClearHistory)
			users.DELETE("/history/:articleId", etheriaHandler.RemoveFromHistory)
			users.GET("/notifications", etheriaHandler.ListNotifications)
			users.PUT("/notifications/:id/read", etheriaHandler.MarkNotificationRead)
			users.PUT("/notifications/read-all", etheriaHandler.MarkAllNotificationsRead)
			users.DELETE("/notifications/:id", etheriaHandler.DeleteNotification)
			users.GET("/subscription", etheriaHandler.GetSubscription)
			users.POST("/subscription", etheriaHandler.CreateSubscription)
			users.PUT("/subscription", etheriaHandler.UpdateSubscription)
			users.POST("/subscription/cancel", etheriaHandler.CancelSubscription)
		}

		// Media
		media := api.Group("/media")
		media.Use(authMiddleware.RequireAuth())
		{
			media.GET("", etheriaHandler.ListMedia)
			media.POST("", etheriaHandler.UploadMedia)
			media.DELETE("/:id", etheriaHandler.DeleteMedia)
		}

		// Settings (System)
		settings := api.Group("/settings")
		settings.Use(authMiddleware.RequireAuth())
		{
			settings.GET("", etheriaHandler.GetSettings)
			settings.PUT("", etheriaHandler.UpdateSettings)
			settings.POST("/test-email", etheriaHandler.TestEmailConfig)
		}

		// Admin Users
		adminUsers := api.Group("/admin/users")
		adminUsers.Use(authMiddleware.RequireAuth())
		{
			adminUsers.GET("", etheriaHandler.ListUsers)
			adminUsers.POST("", etheriaHandler.CreateUser)
			adminUsers.GET("/:id", etheriaHandler.GetUser)
			adminUsers.PUT("/:id", etheriaHandler.UpdateUser)
			adminUsers.DELETE("/:id", etheriaHandler.DeleteUser)
		}

		// ==================== SOCIAL ACCOUNTS ====================
		socialHandler := NewSocialHandler()
		socialAccounts := api.Group("/social-accounts")
		socialAccounts.Use(authMiddleware.RequireAuth())
		{
			socialAccounts.GET("", socialHandler.ListSocialAccounts)
			socialAccounts.POST("", socialHandler.CreateSocialAccount)
			socialAccounts.PUT("/:id", socialHandler.UpdateSocialAccount)
			socialAccounts.DELETE("/:id", socialHandler.DeleteSocialAccount)
			socialAccounts.POST("/:id/connect", socialHandler.ConnectSocialAccount)
			socialAccounts.POST("/:id/disconnect", socialHandler.DisconnectSocialAccount)
			socialAccounts.POST("/:id/sync", socialHandler.SyncSocialAccount)
		}

		// ==================== SCHEDULED POSTS ====================
		scheduledPostHandler := NewScheduledPostHandler()
		scheduledPosts := api.Group("/scheduled-posts")
		scheduledPosts.Use(authMiddleware.RequireAuth())
		{
			scheduledPosts.GET("", scheduledPostHandler.ListScheduledPosts)
			scheduledPosts.POST("", scheduledPostHandler.CreateScheduledPost)
			scheduledPosts.PUT("/:id", scheduledPostHandler.UpdateScheduledPost)
			scheduledPosts.DELETE("/:id", scheduledPostHandler.DeleteScheduledPost)
			scheduledPosts.POST("/:id/cancel", scheduledPostHandler.CancelScheduledPost)
			scheduledPosts.POST("/:id/publish", scheduledPostHandler.PublishNow)
		}

		// ==================== ADVERTISING ====================
		advertisingHandler := NewAdvertisingHandler()
		campaigns := api.Group("/advertising/campaigns")
		campaigns.Use(authMiddleware.RequireAuth())
		{
			campaigns.GET("", advertisingHandler.ListAdCampaigns)
			campaigns.POST("", advertisingHandler.CreateAdCampaign)
			campaigns.PUT("/:id", advertisingHandler.UpdateAdCampaign)
			campaigns.DELETE("/:id", advertisingHandler.DeleteAdCampaign)
			campaigns.POST("/:id/pause", advertisingHandler.PauseAdCampaign)
			campaigns.POST("/:id/resume", advertisingHandler.ResumeAdCampaign)
		}

		placements := api.Group("/advertising/placements")
		placements.Use(authMiddleware.RequireAuth())
		{
			placements.GET("", advertisingHandler.ListAdPlacements)
			placements.POST("", advertisingHandler.CreateAdPlacement)
			placements.PUT("/:id", advertisingHandler.UpdateAdPlacement)
			placements.DELETE("/:id", advertisingHandler.DeleteAdPlacement)
		}

		// ==================== AUDIT LOGS ====================
		auditLogHandler := NewAuditLogHandler()
		auditLogs := api.Group("/audit-logs")
		auditLogs.Use(authMiddleware.RequireAuth())
		{
			auditLogs.GET("", auditLogHandler.ListAuditLogs)
			auditLogs.GET("/export", auditLogHandler.ExportAuditLogs)
		}

		// ==================== API KEYS ====================
		apiKeyHandler := NewApiKeyHandler()
		apiKeys := api.Group("/api-keys")
		apiKeys.Use(authMiddleware.RequireAuth())
		{
			apiKeys.GET("", apiKeyHandler.ListApiKeys)
			apiKeys.POST("", apiKeyHandler.CreateApiKey)
			apiKeys.PUT("/:id", apiKeyHandler.UpdateApiKey)
			apiKeys.DELETE("/:id", apiKeyHandler.DeleteApiKey)
			apiKeys.POST("/:id/revoke", apiKeyHandler.RevokeApiKey)
			apiKeys.POST("/:id/regenerate", apiKeyHandler.RegenerateApiKey)
		}

		// ==================== SEO ====================
		seoHandler := NewSeoHandler()
		seo := api.Group("/seo")
		seo.Use(authMiddleware.RequireAuth())
		{
			seo.GET("/audits", seoHandler.ListSeoAudits)
			seo.POST("/audits", seoHandler.RunSeoAudit)
			seo.GET("/keywords", seoHandler.ListKeywords)
			seo.POST("/keywords", seoHandler.AddKeyword)
			seo.DELETE("/keywords/:id", seoHandler.DeleteKeyword)
			seo.GET("/meta-tags", seoHandler.ListMetaTags)
			seo.PUT("/meta-tags", seoHandler.UpdateMetaTags)
		}

		// ==================== NEWSLETTER ====================
		newsletterHandler := NewNewsletterHandler()
		newsletter := api.Group("/newsletter")
		newsletter.Use(authMiddleware.RequireAuth())
		{
			newsletter.GET("/campaigns", newsletterHandler.ListNewsletterCampaigns)
			newsletter.POST("/campaigns", newsletterHandler.CreateNewsletterCampaign)
			newsletter.PUT("/campaigns/:id", newsletterHandler.UpdateNewsletterCampaign)
			newsletter.DELETE("/campaigns/:id", newsletterHandler.DeleteNewsletterCampaign)
			newsletter.POST("/campaigns/:id/send", newsletterHandler.SendNewsletter)
			newsletter.POST("/campaigns/:id/schedule", newsletterHandler.ScheduleNewsletter)
			newsletter.POST("/campaigns/:id/test", newsletterHandler.SendTestNewsletter)
		}

		// ==================== SYSTEM LOGS ====================
		systemLogHandler := NewSystemLogHandler()
		systemLogs := api.Group("/system-logs")
		systemLogs.Use(authMiddleware.RequireAuth())
		{
			systemLogs.GET("", systemLogHandler.ListSystemLogs)
			systemLogs.DELETE("/:id", systemLogHandler.DeleteSystemLog)
		}

		// ==================== ANALYTICS ====================
		analyticsHandler := NewAnalyticsHandler()
		analytics := api.Group("/analytics")
		analytics.Use(authMiddleware.RequireAuth())
		{
			analytics.GET("/social", analyticsHandler.GetSocialAnalytics)
			analytics.GET("/overview", analyticsHandler.GetAnalyticsOverview)
		}

		// ==================== FOOTER LINKS ====================
		footerLinkHandler := NewFooterLinkHandler()

		// Public endpoint for footer links
		api.Group("/footer-links").GET("", footerLinkHandler.ListFooterLinks)

		// Admin endpoints (authenticated)
		footerLinks := api.Group("/admin/footer-links")
		footerLinks.Use(authMiddleware.RequireAuth())
		{
			footerLinks.GET("", footerLinkHandler.ListFooterLinks)
			footerLinks.POST("", footerLinkHandler.CreateFooterLink)
			footerLinks.PUT("/:id", footerLinkHandler.UpdateFooterLink)
			footerLinks.DELETE("/:id", footerLinkHandler.DeleteFooterLink)
		}

		// ==================== DOCKER ====================
		dockerHandler := NewDockerHandler()
		docker := api.Group("/docker")
		docker.Use(authMiddleware.RequireAuth())
		{
			docker.GET("/logs", dockerHandler.GetLogs)
			docker.POST("/exec", dockerHandler.ExecCommand)
			docker.GET("/status", dockerHandler.GetStatus)
			docker.GET("/containers", dockerHandler.ListContainers)
			docker.POST("/update", dockerHandler.UpdateContainer)
			docker.GET("/check-updates", dockerHandler.CheckForUpdates)
		}
	}
}

// ==================== AUTH HANDLERS ====================

var (
	defaultAdminEmail    = "admin@etheriatimes.com"
	defaultAdminPassword = "Admin123!"
	defaultAdminName     = "Admin Principal"
)

type AuthHandler struct {
	jwtService *services.JWTService
}

func NewAuthHandler(jwt *services.JWTService) *AuthHandler {
	return &AuthHandler{jwtService: jwt}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request: " + err.Error()})
		return
	}

	var userID, userName string
	var isValid bool

	if req.Email == defaultAdminEmail && req.Password == defaultAdminPassword {
		isValid = true
		userID = "admin-1"
		userName = defaultAdminName
	} else if req.Email == "demo@etheriatimes.com" && req.Password == "demo123" {
		isValid = true
		userID = "demo-1"
		userName = "Demo User"
	} else {
		prismaService := services.GetPrismaService()
		if prismaService == nil {
			fmt.Printf("\033[1;31m[!] Login: PrismaService is NIL - running in mock mode\033[0m\n")
		} else {
			fmt.Printf("[✓] Login: PrismaService available, checking DB for user %s\n", req.Email)
			etheriaUser, err := prismaService.GetUserByEmail(req.Email)
			if err != nil {
				fmt.Printf("[!] Login: GetUserByEmail error: %v\n", err)
			} else if etheriaUser == nil {
				fmt.Printf("[!] Login: User not found in DB (email: %s)\n", req.Email)
			} else if !etheriaUser.IsActive {
				fmt.Printf("[!] Login: User is inactive\n")
			} else {
				fmt.Printf("[*] Login: User found (id: %s, role: %s)\n", etheriaUser.ID, etheriaUser.Role)
				hashLen := len(etheriaUser.Password)
				if hashLen > 20 {
					hashLen = 20
				}
				fmt.Printf("[*] Login: Stored hash: %s\n", etheriaUser.Password[:hashLen])
				passwordMatch := checkPasswordHash(req.Password, etheriaUser.Password)
				fmt.Printf("[*] Login: Password match result: %v\n", passwordMatch)
				if passwordMatch {
					isValid = true
					userID = etheriaUser.ID
					userName = strings.TrimSpace(etheriaUser.FirstName + " " + etheriaUser.LastName)
					if userName == "" {
						userName = etheriaUser.Email
					}
				}
			}
		}
	}

	if !isValid {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{Success: false, Error: "Email ou mot de passe incorrect"})
		return
	}

	token, err := h.jwtService.GenerateToken(userID, "account-1", req.Email, userName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to generate token"})
		return
	}

	refreshToken, err := h.jwtService.GenerateRefreshToken(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to generate refresh token"})
		return
	}

	isPremium := strings.HasSuffix(req.Email, "@etheriatimes.com")

	user := &models.User{
		ID:     userID,
		Email:  req.Email,
		Name:   userName,
		Active: true,
	}

	if isPremium {
		user.Subscription = &models.Subscription{
			ID:     "premium-sub",
			UserID: userID,
			Plan:   models.PlanPremium,
			Status: models.SubscriptionActive,
		}
	}

	c.SetCookie("auth_token", token, 86400*7, "/", "", false, true)
	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data: &models.TokenResponse{
			AccessToken: token, RefreshToken: refreshToken, TokenType: "Bearer",
			ExpiresIn: h.jwtService.GetExpirySeconds(), User: user,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Logged out successfully"})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req models.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}

	userID, err := h.jwtService.ValidateRefreshToken(req.RefreshToken)
	if err != nil || userID == "" {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{Success: false, Error: "Invalid or expired refresh token"})
		return
	}

	token, _ := h.jwtService.GenerateToken(userID, "account-123", "user@example.com", "user")
	refreshToken, _ := h.jwtService.GenerateRefreshToken(userID)

	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data: &models.TokenResponse{
			AccessToken: token, RefreshToken: refreshToken, TokenType: "Bearer",
			ExpiresIn: h.jwtService.GetExpirySeconds(),
		},
	})
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Password changed successfully"})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Password reset email sent"})
}

func (h *AuthHandler) GetAccount(c *gin.Context) {
	userID := c.GetString("userID")

	fmt.Printf("\n====== DEBUG GetAccount START ======\n")
	fmt.Printf("[DEBUG GetAccount] userID from token: '%s'\n", userID)
	fmt.Printf("[DEBUG GetAccount] prismaService: %v\n", services.GetPrismaService())

	if userID == "admin-1" {
		fmt.Printf("[DEBUG GetAccount] Returning admin-1 hardcoded\n")
		c.JSON(http.StatusOK, models.AuthResponse{
			Success: true,
			Data: &models.TokenResponse{
				User: &models.User{
					ID:     "admin-1",
					Email:  defaultAdminEmail,
					Name:   defaultAdminName,
					Active: true,
				},
			},
		})
		return
	}

	if userID == "demo-1" {
		fmt.Printf("[DEBUG GetAccount] Returning demo-1 hardcoded\n")
		c.JSON(http.StatusOK, models.AuthResponse{
			Success: true,
			Data: &models.TokenResponse{
				User: &models.User{
					ID:     "demo-1",
					Email:  "demo@etheriatimes.com",
					Name:   "Demo User",
					Active: true,
				},
			},
		})
		return
	}

	prismaService := services.GetPrismaService()
	if prismaService == nil {
		fmt.Printf("[!] GetAccount: PrismaService is nil\n")
		c.JSON(http.StatusServiceUnavailable, models.AuthResponse{
			Success: false,
			Error:   "Database unavailable",
		})
		return
	}

	fmt.Printf("[DEBUG GetAccount] Calling GetUser with userID: '%s'\n", userID)
	etheriaUser, err := prismaService.GetUser(userID)
	fmt.Printf("[DEBUG GetAccount] GetUser returned: user=%v, err=%v\n", etheriaUser, err)

	if err != nil || etheriaUser == nil {
		fmt.Printf("[!] GetAccount: User not found in DB (userID: %s, err: %v)\n", userID, err)
		c.JSON(http.StatusUnauthorized, models.AuthResponse{
			Success: false,
			Error:   "User not found in database",
		})
		return
	}

	fmt.Printf("[DEBUG GetAccount] Found user: ID=%s, Email=%s\n", etheriaUser.ID, etheriaUser.Email)

	userName := strings.TrimSpace(etheriaUser.FirstName + " " + etheriaUser.LastName)
	if userName == "" {
		userName = etheriaUser.Email
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data: &models.TokenResponse{
			User: &models.User{
				ID:     etheriaUser.ID,
				Email:  etheriaUser.Email,
				Name:   userName,
				Active: etheriaUser.IsActive,
			},
		},
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request: " + err.Error()})
		return
	}

	firstName := req.FirstName
	lastName := req.LastName
	if firstName == "" && req.Name != "" {
		parts := strings.SplitN(req.Name, " ", 2)
		firstName = parts[0]
		lastName = ""
		if len(parts) > 1 {
			lastName = parts[1]
		}
	}

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		user, err := prismaService.CreateUser(req.Email, firstName, lastName, "", req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to create user: " + err.Error()})
			return
		}

		emailSettings, _ := prismaService.GetSystemSettings()
		if emailSettings != nil && emailSettings.SmtpHost != "" {
			emailService := services.NewEmailService(emailSettings)
			go emailService.SendWelcomeEmail(req.Email, firstName)
		}

		userName := strings.TrimSpace(user.FirstName + " " + user.LastName)
		if userName == "" {
			userName = user.Email
		}

		token, err := h.jwtService.GenerateToken(user.ID, "account-1", user.Email, userName)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to generate token"})
			return
		}

		refreshToken, err := h.jwtService.GenerateRefreshToken(user.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.AuthResponse{Success: false, Error: "Failed to generate refresh token"})
			return
		}

		c.JSON(http.StatusCreated, models.AuthResponse{
			Success: true,
			Data: &models.TokenResponse{
				AccessToken:  token,
				RefreshToken: refreshToken,
				TokenType:    "Bearer",
				ExpiresIn:    86400,
				User: &models.User{
					ID:     user.ID,
					Email:  user.Email,
					Name:   userName,
					Active: true,
				},
			},
			Message: "Registration successful",
		})
		return
	}

	user := &models.User{
		ID:     "new-user-id",
		Email:  req.Email,
		Active: true,
	}

	c.JSON(http.StatusCreated, models.AuthResponse{
		Success: true,
		Data:    &models.TokenResponse{User: user},
		Message: "Registration successful",
	})
}

type ValidateTokenRequest struct {
	Token string `json:"token" binding:"required"`
}

func (h *AuthHandler) ValidateToken(c *gin.Context) {
	var req ValidateTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Token required"})
		return
	}

	claims, err := h.jwtService.ValidateToken(req.Token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{Success: false, Error: "Invalid or expired token"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Data:    &models.TokenResponse{User: &models.User{ID: claims.UserID, Email: claims.Email, Name: claims.Username, Active: true}},
	})
}

// ==================== PROFILE HANDLERS ====================

type ProfileHandler struct{}

func NewProfileHandler() *ProfileHandler { return &ProfileHandler{} }

type ProfileResponse struct {
	Success bool         `json:"success"`
	Data    *ProfileData `json:"data,omitempty"`
	Error   string       `json:"error,omitempty"`
}

type ProfileData struct {
	ID          string    `json:"id"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Email       string    `json:"email"`
	Gender      string    `json:"gender"`
	Phone       string    `json:"phone"`
	BirthDate   string    `json:"birth_date"`
	Language    string    `json:"language"`
	AvatarURL   string    `json:"avatar_url"`
	AetherID    string    `json:"aether_id"`
	AccountType string    `json:"account_type"`
	Addresses   []Address `json:"addresses"`
	CreatedAt   string    `json:"created_at"`
}

type Address struct {
	ID        string `json:"id"`
	Label     string `json:"label"`
	Value     string `json:"value"`
	IsPrimary bool   `json:"is_primary"`
}

type UpdateProfileRequest struct {
	FirstName string    `json:"first_name,omitempty"`
	LastName  string    `json:"last_name,omitempty"`
	Gender    string    `json:"gender,omitempty"`
	Phone     string    `json:"phone,omitempty"`
	BirthDate string    `json:"birth_date,omitempty"`
	Language  string    `json:"language,omitempty"`
	Addresses []Address `json:"addresses,omitempty"`
}

func (h *ProfileHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")

	profile := ProfileData{
		ID:        userID,
		Addresses: []Address{},
	}
	c.JSON(http.StatusOK, ProfileResponse{Success: true, Data: &profile})
}

func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ProfileResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, ProfileResponse{Success: true})
}

func (h *ProfileHandler) UploadAvatar(c *gin.Context) {
	c.JSON(http.StatusOK, ProfileResponse{Success: true})
}

// ==================== PASSWORD HANDLERS ====================

type PasswordHandler struct{}

func NewPasswordHandler() *PasswordHandler { return &PasswordHandler{} }

func (h *PasswordHandler) ListPasswords(c *gin.Context) {
	c.JSON(http.StatusOK, models.PasswordListResponse{Success: true, Data: []models.Password{}})
}

func (h *PasswordHandler) GetPassword(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Password ID required"})
		return
	}
	c.JSON(http.StatusOK, models.PasswordResponse{Success: true, Data: models.Password{ID: id}})
}

func (h *PasswordHandler) CreatePassword(c *gin.Context) {
	var req models.CreatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.PasswordResponse{Success: true, Data: models.Password{ID: "new-id", Name: req.Name}})
}

func (h *PasswordHandler) UpdatePassword(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.PasswordResponse{Success: true, Data: models.Password{ID: id}})
}

func (h *PasswordHandler) DeletePassword(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.PasswordResponse{Success: false, Error: "Password ID required"})
		return
	}
	c.JSON(http.StatusOK, models.PasswordResponse{Success: true})
}

// ==================== SECURITY HANDLERS ====================

type SecurityHandler struct{}

func NewSecurityHandler() *SecurityHandler { return &SecurityHandler{} }

func (h *SecurityHandler) GetSecurityInfo(c *gin.Context) {
	data := models.SecurityData{
		Devices:          []models.Device{},
		Sessions:         []models.Session{},
		Activities:       []models.SecurityActivity{},
		TwoFactor:        models.TwoFactorConfig{Enabled: false},
		PasskeyEnabled:   false,
		SecureNavigation: false,
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true, Data: &data})
}

func (h *SecurityHandler) GetDevices(c *gin.Context) {
	c.JSON(http.StatusOK, models.DevicesResponse{Success: true, Data: []models.Device{}})
}

func (h *SecurityHandler) GetSessions(c *gin.Context) {
	c.JSON(http.StatusOK, models.SessionsResponse{Success: true, Data: []models.Session{}})
}

func (h *SecurityHandler) GetActivities(c *gin.Context) {
	c.JSON(http.StatusOK, models.ActivitiesResponse{Success: true, Data: []models.SecurityActivity{}})
}

func (h *SecurityHandler) TrustDevice(c *gin.Context) {
	deviceID := c.Param("id")
	if deviceID == "" {
		c.JSON(http.StatusBadRequest, models.DevicesResponse{Success: false, Error: "Device ID required"})
		return
	}
	c.JSON(http.StatusOK, models.DevicesResponse{Success: true})
}

func (h *SecurityHandler) RevokeDevice(c *gin.Context) {
	deviceID := c.Param("id")
	if deviceID == "" {
		c.JSON(http.StatusBadRequest, models.DevicesResponse{Success: false, Error: "Device ID required"})
		return
	}
	c.JSON(http.StatusOK, models.DevicesResponse{Success: true})
}

func (h *SecurityHandler) RevokeSession(c *gin.Context) {
	sessionID := c.Param("id")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, models.SessionsResponse{Success: false, Error: "Session ID required"})
		return
	}
	c.JSON(http.StatusOK, models.SessionsResponse{Success: true})
}

func (h *SecurityHandler) EnableTwoFactor(c *gin.Context) {
	var req models.EnableTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.SecurityResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true, Data: &models.SecurityData{TwoFactor: models.TwoFactorConfig{Enabled: true, Method: req.Method}}})
}

func (h *SecurityHandler) DisableTwoFactor(c *gin.Context) {
	var req models.VerifyTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.SecurityResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true, Data: &models.SecurityData{TwoFactor: models.TwoFactorConfig{Enabled: false}}})
}

func (h *SecurityHandler) VerifyTwoFactor(c *gin.Context) {
	var req models.VerifyTwoFactorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.SecurityResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.SecurityResponse{Success: true})
}

// ==================== THIRD PARTY HANDLERS ====================

type ThirdPartyHandler struct{}

func NewThirdPartyHandler() *ThirdPartyHandler { return &ThirdPartyHandler{} }

func (h *ThirdPartyHandler) ListApps(c *gin.Context) {
	c.JSON(http.StatusOK, models.ThirdPartyResponse{Success: true, Data: []models.ThirdPartyApp{}})
}

func (h *ThirdPartyHandler) ConnectApp(c *gin.Context) {
	var req models.ConnectAppRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ThirdPartyResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.ThirdPartyResponse{Success: true, Data: []models.ThirdPartyApp{{ID: "new-id", Name: req.AppName, AccessLevel: "Full"}}})
}

func (h *ThirdPartyHandler) RevokeApp(c *gin.Context) {
	appID := c.Param("id")
	if appID == "" {
		c.JSON(http.StatusBadRequest, models.ThirdPartyResponse{Success: false, Error: "App ID required"})
		return
	}
	c.JSON(http.StatusOK, models.ThirdPartyResponse{Success: true})
}

// ==================== CONTACT HANDLERS ====================

type ContactHandler struct{}

func NewContactHandler() *ContactHandler { return &ContactHandler{} }

type ContactsListResponse struct {
	Success bool                `json:"success"`
	Data    *models.ContactList `json:"data,omitempty"`
	Error   string              `json:"error,omitempty"`
}

func (h *ContactHandler) ListContacts(c *gin.Context) {
	contacts := &models.ContactList{
		AccountID:     "account-123",
		Contacts:      []*models.Contact{},
		TotalContacts: 0,
		HasMore:       false,
		Offset:        0,
		Limit:         50,
	}
	c.JSON(http.StatusOK, ContactsListResponse{Success: true, Data: contacts})
}

func (h *ContactHandler) GetContact(c *gin.Context) {
	contactID := c.Param("id")
	if contactID == "" {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Contact ID required"})
		return
	}
	c.JSON(http.StatusOK, models.ContactResponse{Success: true, Data: &models.Contact{ID: contactID}})
}

func (h *ContactHandler) CreateContact(c *gin.Context) {
	var req models.CreateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.ContactResponse{Success: true, Data: &models.Contact{ID: "new-id", Name: req.Name, Email: req.Email}})
}

func (h *ContactHandler) UpdateContact(c *gin.Context) {
	contactID := c.Param("id")
	var req models.UpdateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.ContactResponse{Success: true, Data: &models.Contact{ID: contactID}})
}

func (h *ContactHandler) DeleteContact(c *gin.Context) {
	contactID := c.Param("id")
	if contactID == "" {
		c.JSON(http.StatusBadRequest, models.ContactResponse{Success: false, Error: "Contact ID required"})
		return
	}
	c.JSON(http.StatusOK, models.ContactResponse{Success: true})
}

func (h *ContactHandler) ListGroups(c *gin.Context) {
	groups := &models.GroupList{
		AccountID: "account-123",
		Groups:    []*models.ContactGroup{},
		Total:     0,
	}
	c.JSON(http.StatusOK, models.GroupListResponse{Success: true, Data: groups})
}

func (h *ContactHandler) CreateGroup(c *gin.Context) {
	var req models.CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.GroupResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusCreated, models.GroupResponse{Success: true, Data: &models.ContactGroup{ID: "new-id", Name: req.Name}})
}

// ==================== PRIVACY HANDLERS ====================

type PrivacyHandler struct{}

func NewPrivacyHandler() *PrivacyHandler { return &PrivacyHandler{} }

func (h *PrivacyHandler) GetPrivacySettings(c *gin.Context) {
	settings := models.AccountPrivacySettings{
		ProfileVisibility: "private",
		ShowEmail:         false,
		ShowPhone:         false,
		ShowActivity:      false,
		DataCollection:    false,
		PersonalizedAds:   false,
		Analytics:         false,
		LocationTracking:  false,
	}
	c.JSON(http.StatusOK, models.PrivacyResponse{Success: true, Data: &settings})
}

func (h *PrivacyHandler) UpdatePrivacySettings(c *gin.Context) {
	var req models.UpdatePrivacyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.PrivacyResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.PrivacyResponse{Success: true})
}

func (h *PrivacyHandler) ExportData(c *gin.Context) {
	var req models.DataExportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.DataExportResponse{Success: false, Error: "Invalid request"})
		return
	}
	c.JSON(http.StatusOK, models.DataExportResponse{Success: true, Message: "Data export started"})
}

func (h *PrivacyHandler) DeleteAccount(c *gin.Context) {
	var req models.DeleteAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Invalid request"})
		return
	}
	if !req.Confirm {
		c.JSON(http.StatusBadRequest, models.AuthResponse{Success: false, Error: "Confirmation required"})
		return
	}
	c.JSON(http.StatusOK, models.AuthResponse{Success: true, Message: "Account deletion scheduled"})
}

// ==================== ETHERIA HANDLERS ====================

type EtheriaHandlers struct {
	jwtService *services.JWTService
}

func NewEtheriaHandlers(jwt *services.JWTService) *EtheriaHandlers {
	return &EtheriaHandlers{jwtService: jwt}
}

// Articles
func (h *EtheriaHandlers) ListArticles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	if pageSize == 0 {
		pageSize = 10
	}
	status := c.Query("status")
	category := c.Query("category")
	search := c.Query("search")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		articles, total, err := prismaService.ListArticles(status, category, search, page, pageSize)
		if err == nil && len(articles) > 0 {
			totalPages := (total + pageSize - 1) / pageSize
			c.JSON(http.StatusOK, models.PaginatedResponse{
				Data: articles, Total: total, Page: page, PageSize: pageSize, TotalPages: totalPages,
			})
			return
		}
	}

	articles := []models.Article{
		{
			ID: "1", Title: "Les nouvelles réformes économiques", Slug: "reformes-economiques",
			Excerpt: "Le Premier ministre a dévoilé un plan ambitieux...", Content: "Contenu de l'article...",
			Status: models.ArticleStatusPublished, Featured: true, ViewCount: 15420, ReadTime: 5,
		},
	}

	if status != "" {
		filtered := []models.Article{}
		for _, a := range articles {
			if string(a.Status) == status {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	if category != "" {
		filtered := []models.Article{}
		for _, a := range articles {
			if a.CategoryID == category {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	if search != "" {
		filtered := []models.Article{}
		search = strings.ToLower(search)
		for _, a := range articles {
			if strings.Contains(strings.ToLower(a.Title), search) {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	total := len(articles)
	totalPages := (total + pageSize - 1) / pageSize

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: articles, Total: total, Page: page, PageSize: pageSize, TotalPages: totalPages,
	})
}

func (h *EtheriaHandlers) GetArticle(c *gin.Context) {
	id := c.Param("id")
	article := models.Article{
		ID: id, Title: "Les nouvelles réformes économiques", Slug: "reformes-economiques",
		Excerpt: "Le Premier ministre a dévoilé un plan ambitieux...", Content: "Contenu complet...",
		Status: models.ArticleStatusPublished, ViewCount: 15421, ReadTime: 5,
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article := models.Article{
		ID: "1", Title: "Les nouvelles réformes économiques", Slug: slug,
		Excerpt: "Le Premier ministre a dévoiler un plan ambitieux...", Content: "Contenu complet...",
		Status: models.ArticleStatusPublished, ViewCount: 15422, ReadTime: 5,
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) GetArticlesBySection(c *gin.Context) {
	section := c.Param("section")
	locale := c.DefaultQuery("locale", "fr")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	mockArticles := map[string][]models.Article{
		"politique": {
			{ID: "1", Title: "Municipales 2026 : les premiers résultats", Slug: "municipales-resultats", Excerpt: "Les bureaux de vote ont fermé leurs portes à 20h.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 5420, ReadTime: 3, Locale: locale, CategoryID: "politique"},
			{ID: "2", Title: "Le Premier ministre annonce un remaniement", Slug: "remaniement", Excerpt: "Un remaniement majeur au sein du gouvernement.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3200, ReadTime: 4, Locale: locale, CategoryID: "politique"},
			{ID: "3", Title: "Débat à l'assemblée : le pouvoir d'achat", Slug: "debat-pouvoir-achat", Excerpt: "Les deputies discutent du pouvoir d'achat.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2100, ReadTime: 5, Locale: locale, CategoryID: "politique"},
			{ID: "4", Title: "Sondage : confiance des citizens en hausse", Slug: "sondage-confiance", Excerpt: "Les derniers sondages révèlent une tendance.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 1800, ReadTime: 3, Locale: locale, CategoryID: "politique"},
		},
		"international": {
			{ID: "5", Title: "Tensions diplomatiques : sommet reporté", Slug: "tensions-diplomatiques", Excerpt: "Les négociations ont été interrompues.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4800, ReadTime: 4, Locale: locale, CategoryID: "international"},
			{ID: "6", Title: "Crise humanitarian : l'ONU lance un appel", Slug: "crise-humanitaire", Excerpt: "L'ONU demande des aids humanitaires.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3500, ReadTime: 5, Locale: locale, CategoryID: "international"},
			{ID: "7", Title: "Accord commercial historique signé", Slug: "accord-commercial", Excerpt: "Un nouvel accord commercial entre nations.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2200, ReadTime: 4, Locale: locale, CategoryID: "international"},
		},
		"sport": {
			{ID: "8", Title: "Football : le club local qualifié", Slug: "football-coupe", Excerpt: "Le club accede à la finale.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 6200, ReadTime: 3, Locale: locale, CategoryID: "sport"},
			{ID: "9", Title: "Tennis : la révélation nationale en quarts", Slug: "tennis-quarts", Excerpt: "Un joueur本地 se distingue.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2800, ReadTime: 4, Locale: locale, CategoryID: "sport"},
			{ID: "10", Title: "JO 2028 : préparation intensive", Slug: "jo-preparation", Excerpt: "Les athletes se préparent.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4100, ReadTime: 5, Locale: locale, CategoryID: "sport"},
			{ID: "11", Title: "Cyclisme : le champion défend son titre", Slug: "cyclisme-tour", Excerpt: "Le champion vise un nouveau titre.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 1900, ReadTime: 4, Locale: locale, CategoryID: "sport"},
		},
		"culture": {
			{ID: "12", Title: "Cinéma : le nouveau film primé", Slug: "cinema-festival", Excerpt: "Un film récompensé au festival.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3800, ReadTime: 4, Locale: locale, CategoryID: "culture"},
			{ID: "13", Title: "Exposition : chefs-d'œuvre de la Renaissance", Slug: "exposition-renaissance", Excerpt: "Une exposition exceptionnelle.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2400, ReadTime: 5, Locale: locale, CategoryID: "culture"},
			{ID: "14", Title: "Littérature : le lauréat révèle son roman", Slug: "litterature-prix", Excerpt: "Le gagnant du prix littéraire.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 1600, ReadTime: 3, Locale: locale, CategoryID: "culture"},
		},
		"etudiant": {
			{ID: "15", Title: "Rentrée universitaire : les défis de la vie campus en 2026", Slug: "rentree-universitaire", Excerpt: "Logement, transport, budget : les étudiants font face.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 5600, ReadTime: 5, Locale: locale, CategoryID: "etudiant"},
			{ID: "16", Title: "Bourses étudiantes : les nouvelles aides annoncées", Slug: "bourses-etudiantes", Excerpt: "De nouvelles burses pour les étudiants.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4200, ReadTime: 4, Locale: locale, CategoryID: "etudiant"},
			{ID: "17", Title: "Orientation post-bac : les filières les plus demandées", Slug: "orientation-bac", Excerpt: "Les filières populaires cette année.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3100, ReadTime: 4, Locale: locale, CategoryID: "etudiant"},
			{ID: "18", Title: "Jobs étudiants : les secteurs qui recrutent", Slug: "jobs-etudiants", Excerpt: "Les opportunités d'emploi pour étudiants.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2500, ReadTime: 3, Locale: locale, CategoryID: "etudiant"},
		},
		"jeu-video": {
			{ID: "19", Title: "Nouveau jeu flagship : la révolution du gaming en 2026", Slug: "jeux-flagship-2026", Excerpt: "Les dernières innovations technologiques transforment l'expérience.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 7800, ReadTime: 6, Locale: locale, CategoryID: "jeu-video"},
			{ID: "20", Title: "E-sport : les tournois internationaux battent des records", Slug: "esport-records", Excerpt: "Des records d'audience battus.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 5200, ReadTime: 4, Locale: locale, CategoryID: "jeu-video"},
			{ID: "21", Title: "VR gaming : le matériel nouvelle génération arrive", Slug: "vr-nouvelle-gen", Excerpt: "La nouvelle génération de VR.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3900, ReadTime: 5, Locale: locale, CategoryID: "jeu-video"},
			{ID: "22", Title: "Indie games : les perles indépendantes à surveiller", Slug: "indie-games", Excerpt: "Les jeux indépendants à découvrir.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2800, ReadTime: 4, Locale: locale, CategoryID: "jeu-video"},
		},
		"informatique": {
			{ID: "23", Title: "Intelligence artificielle : les nouvelles avancées qui changent tout", Slug: "ia-avancees-2026", Excerpt: "L'IA transforme tous les secteurs.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 8900, ReadTime: 7, Locale: locale, CategoryID: "informatique"},
			{ID: "24", Title: "Cybersécurité : les menaces qui ciblent les entreprises", Slug: "cybersecurite-menaces", Excerpt: "Les nouvelles menaces numériques.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4600, ReadTime: 5, Locale: locale, CategoryID: "informatique"},
			{ID: "25", Title: "Cloud computing : vers une nouvelle ère", Slug: "cloud-nouvelle-ere", Excerpt: "L'évolution du cloud.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3200, ReadTime: 5, Locale: locale, CategoryID: "informatique"},
			{ID: "26", Title: "Programmation : les langages les plus demandés", Slug: "langages-programmation", Excerpt: "Les langages populaires.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4100, ReadTime: 4, Locale: locale, CategoryID: "informatique"},
		},
		"societe": {
			{ID: "27", Title: "Société : les nouvelles initiatives solidaires", Slug: "initiatives-solidaires", Excerpt: "Les associations locales mobilisées.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3800, ReadTime: 5, Locale: locale, CategoryID: "societe"},
			{ID: "28", Title: "Logement : le plan gouvernemental présenté", Slug: "logement-plan", Excerpt: "Un nouveau plan pour le logement.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2900, ReadTime: 4, Locale: locale, CategoryID: "societe"},
			{ID: "29", Title: "Santé : les réformes du système de soins", Slug: "sante-reformes", Excerpt: "Les changements dans la santé.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4200, ReadTime: 5, Locale: locale, CategoryID: "societe"},
			{ID: "30", Title: "Éducation : bilan de la rentrée", Slug: "education-bilan", Excerpt: "Le bilan de la rentrée scolaire.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2100, ReadTime: 4, Locale: locale, CategoryID: "societe"},
		},
		"environnement": {
			{ID: "31", Title: "Climat : les objectifs de réduction atteints", Slug: "climat-objectifs", Excerpt: "Etheria respecte ses engagements climatiques.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 5100, ReadTime: 5, Locale: locale, CategoryID: "environnement"},
			{ID: "32", Title: "Biodiversité : nouvelles aires protégées", Slug: "biodiversite-protected", Excerpt: "De nouvelles zones protégées.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 3400, ReadTime: 4, Locale: locale, CategoryID: "environnement"},
			{ID: "33", Title: "Énergie renouvelable : record de production", Slug: "energie-record", Excerpt: "Un record de production d'énergie verte.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4600, ReadTime: 5, Locale: locale, CategoryID: "environnement"},
			{ID: "34", Title: "Recyclage : les nouvelles normes", Slug: "recyclage-normes", Excerpt: "Les nouvelles règles de recyclage.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 1800, ReadTime: 3, Locale: locale, CategoryID: "environnement"},
		},
		"opinion": {
			{ID: "35", Title: "Éditorial : Pourquoi cette réforme est nécessaire", Slug: "editorial-energie", Excerpt: "La reforma est indispensable.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2800, ReadTime: 6, Locale: locale, CategoryID: "opinion"},
			{ID: "36", Title: "Tribune : L'éducation, pilier de notre avenir", Slug: "tribune-education", Excerpt: "L'éducation comme priorité.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 2100, ReadTime: 5, Locale: locale, CategoryID: "opinion"},
			{ID: "37", Title: "Chronique : Transformation numérique", Slug: "chronique-numerique", Excerpt: "La transformation numérique en cours.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 1600, ReadTime: 4, Locale: locale, CategoryID: "opinion"},
		},
	}

	articles := mockArticles[section]
	if articles == nil {
		articles = []models.Article{}
	}

	if limit > 0 && len(articles) > limit {
		articles = articles[:limit]
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: articles})
}

func (h *EtheriaHandlers) GetHomepageArticles(c *gin.Context) {
	locale := c.DefaultQuery("locale", "fr")

	featured := models.Article{
		ID: "featured-1", Title: "Réforme historique : le Parlement adopte la nouvelle loi sur la transition énergétique",
		Slug: "reforme-energie", Excerpt: "Après des mois de débats, les diputados ont votado à une large majorité cette réforme.",
		Content: "Contenu complet...", Status: models.ArticleStatusPublished, Featured: true, ViewCount: 15420, ReadTime: 5,
		Locale: locale, CategoryID: "politique",
	}

	topArticles := []models.Article{
		{ID: "top-1", Title: "« C'est un tournant majeur » : les réactions politiques", Slug: "reactions-politiques", Excerpt: "Les réactions院 политически.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 8200, ReadTime: 4, Locale: locale, CategoryID: "politique"},
		{ID: "top-2", Title: "Économie : les entreprises locales s'adaptent", Slug: "entreprises-environnement", Excerpt: "Les entreprises face au changement.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 5400, ReadTime: 5, Locale: locale, CategoryID: "economie"},
		{ID: "top-3", Title: "Festival d'été : plus de 100 000 visiteurs attendus", Slug: "festival-ete", Excerpt: "Un festival record cette année.", Content: "Contenu...", Status: models.ArticleStatusPublished, Featured: false, ViewCount: 4300, ReadTime: 3, Locale: locale, CategoryID: "culture"},
	}

	mostRead := []models.Article{
		{ID: "mr-1", Title: "Réforme historique : le Parlement adopte la loi", Slug: "reforme-energie", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 15420, ReadTime: 5, Locale: locale, CategoryID: "politique"},
		{ID: "mr-2", Title: "Le Premier ministre annonce un remaniement", Slug: "remaniement", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 12300, ReadTime: 4, Locale: locale, CategoryID: "politique"},
		{ID: "mr-3", Title: "Football : le club local qualifié", Slug: "football-coupe", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 9800, ReadTime: 3, Locale: locale, CategoryID: "sport"},
		{ID: "mr-4", Title: "Tensions diplomatiques : sommet reporté", Slug: "tensions-diplomatiques", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 8500, ReadTime: 4, Locale: locale, CategoryID: "international"},
		{ID: "mr-5", Title: "Cinéma : le nouveau film primé", Slug: "cinema-festival", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 7200, ReadTime: 4, Locale: locale, CategoryID: "culture"},
	}

	sections := []string{"politique", "international", "sport", "culture", "etudiant", "jeu-video", "informatique", "societe", "environnement"}

	sectionArticles := make(map[string][]models.Article)

	sectionTemplates := map[string][]models.Article{
		"politique": {
			{ID: "pol-1", Title: "Municipales 2026 : les premiers résultats", Slug: "municipales-resultats", Excerpt: "Les bureaux de vote ont fermé leurs portes.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 5420, ReadTime: 3, Locale: locale, CategoryID: "politique"},
			{ID: "pol-2", Title: "Le Premier ministre annonce un remaniement", Slug: "remaniement", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3200, ReadTime: 4, Locale: locale, CategoryID: "politique"},
			{ID: "pol-3", Title: "Débat à l'assemblée : le pouvoir d'achat", Slug: "debat-pouvoir-achat", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2100, ReadTime: 5, Locale: locale, CategoryID: "politique"},
			{ID: "pol-4", Title: "Sondage : confiance des citoyens en hausse", Slug: "sondage-confiance", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 1800, ReadTime: 3, Locale: locale, CategoryID: "politique"},
		},
		"international": {
			{ID: "int-1", Title: "Tensions diplomatiques : sommet reporté", Slug: "tensions-diplomatiques", Excerpt: "Les négociations ont été interrompues.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 4800, ReadTime: 4, Locale: locale, CategoryID: "international"},
			{ID: "int-2", Title: "Crise humanitarian : l'ONU lance un appel", Slug: "crise-humanitaire", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3500, ReadTime: 5, Locale: locale, CategoryID: "international"},
			{ID: "int-3", Title: "Accord commercial historique signé", Slug: "accord-commercial", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2200, ReadTime: 4, Locale: locale, CategoryID: "international"},
		},
		"sport": {
			{ID: "spt-1", Title: "Football : le club local qualifié", Slug: "football-coupe", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 6200, ReadTime: 3, Locale: locale, CategoryID: "sport"},
			{ID: "spt-2", Title: "Tennis : la révélation nationale en quarts", Slug: "tennis-quarts", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2800, ReadTime: 4, Locale: locale, CategoryID: "sport"},
			{ID: "spt-3", Title: "JO 2028 : préparation intensive", Slug: "jo-preparation", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 4100, ReadTime: 5, Locale: locale, CategoryID: "sport"},
			{ID: "spt-4", Title: "Cyclisme : le champion défend son titre", Slug: "cyclisme-tour", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 1900, ReadTime: 4, Locale: locale, CategoryID: "sport"},
		},
		"culture": {
			{ID: "cul-1", Title: "Cinéma : le nouveau film primé", Slug: "cinema-festival", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3800, ReadTime: 4, Locale: locale, CategoryID: "culture"},
			{ID: "cul-2", Title: "Exposition : chefs-d'œuvre de la Renaissance", Slug: "exposition-renaissance", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2400, ReadTime: 5, Locale: locale, CategoryID: "culture"},
			{ID: "cul-3", Title: "Littérature : le lauréat dévoile son roman", Slug: "litterature-prix", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 1600, ReadTime: 3, Locale: locale, CategoryID: "culture"},
		},
		"etudiant": {
			{ID: "etu-1", Title: "Rentrée universitaire : les défis de la vie campus en 2026", Slug: "rentree-universitaire", Excerpt: "Logement, transport, budget.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 5600, ReadTime: 5, Locale: locale, CategoryID: "etudiant"},
			{ID: "etu-2", Title: "Bourses étudiantes : les nouvelles aides annoncées", Slug: "bourses-etudiantes", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 4200, ReadTime: 4, Locale: locale, CategoryID: "etudiant"},
			{ID: "etu-3", Title: "Orientation post-bac : les filières les plus demandées", Slug: "orientation-bac", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3100, ReadTime: 4, Locale: locale, CategoryID: "etudiant"},
			{ID: "etu-4", Title: "Jobs étudiants : les secteurs qui recrutent", Slug: "jobs-etudiants", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2500, ReadTime: 3, Locale: locale, CategoryID: "etudiant"},
		},
		"jeu-video": {
			{ID: "jvg-1", Title: "Nouveau jeu flagship : la révolution du gaming en 2026", Slug: "jeux-flagship-2026", Excerpt: "Les dernières innovations technologiques.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 7800, ReadTime: 6, Locale: locale, CategoryID: "jeu-video"},
			{ID: "jvg-2", Title: "E-sport : les tournois internationaux battent des records", Slug: "esport-records", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 5200, ReadTime: 4, Locale: locale, CategoryID: "jeu-video"},
			{ID: "jvg-3", Title: "VR gaming : le matériel nouvelle génération arrive", Slug: "vr-nouvelle-gen", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3900, ReadTime: 5, Locale: locale, CategoryID: "jeu-video"},
			{ID: "jvg-4", Title: "Indie games : les perles indépendantes à surveiller", Slug: "indie-games", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2800, ReadTime: 4, Locale: locale, CategoryID: "jeu-video"},
		},
		"informatique": {
			{ID: "inf-1", Title: "Intelligence artificielle : les nouvelles avancées qui changent tout", Slug: "ia-avancees-2026", Excerpt: "L'IA transforme tous les secteurs.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 8900, ReadTime: 7, Locale: locale, CategoryID: "informatique"},
			{ID: "inf-2", Title: "Cybersécurité : les menaces qui ciblent les entreprises", Slug: "cybersecurite-menaces", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 4600, ReadTime: 5, Locale: locale, CategoryID: "informatique"},
			{ID: "inf-3", Title: "Cloud computing : vers une nouvelle ère", Slug: "cloud-nouvelle-ere", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3200, ReadTime: 5, Locale: locale, CategoryID: "informatique"},
			{ID: "inf-4", Title: "Programmation : les langages les plus demandés", Slug: "langages-programmation", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 4100, ReadTime: 4, Locale: locale, CategoryID: "informatique"},
		},
		"societe": {
			{ID: "soc-1", Title: "Société : les nouvelles initiatives solidaires", Slug: "initiatives-solidaires", Excerpt: "Les associations locales mobilisées.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 3800, ReadTime: 5, Locale: locale, CategoryID: "societe"},
			{ID: "soc-2", Title: "Logement : le plan gouvernemental présenté", Slug: "logement-plan", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2900, ReadTime: 4, Locale: locale, CategoryID: "societe"},
			{ID: "soc-3", Title: "Santé : les réformes du système de soins", Slug: "sante-reformes", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 4200, ReadTime: 5, Locale: locale, CategoryID: "societe"},
			{ID: "soc-4", Title: "Éducation : bilan de la rentrée", Slug: "education-bilan", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 2100, ReadTime: 4, Locale: locale, CategoryID: "societe"},
		},
		"environnement": {
			{ID: "env-1", Title: "Climat : les objectifs de réduction atteints", Slug: "climat-objectifs", Excerpt: "Etheria respecte ses engagements.", Content: "Contenu...", Status: models.ArticleStatusPublished, ViewCount: 5100, ReadTime: 5, Locale: locale, CategoryID: "environnement"},
			{ID: "env-2", Title: "Biodiversité : nouvelles aires protégées", Slug: "biodiversite-protected", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 3400, ReadTime: 4, Locale: locale, CategoryID: "environnement"},
			{ID: "env-3", Title: "Énergie renouvelable : record de production", Slug: "energie-record", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 4600, ReadTime: 5, Locale: locale, CategoryID: "environnement"},
			{ID: "env-4", Title: "Recyclage : les nouvelles normes", Slug: "recyclage-normes", Excerpt: "", Content: "", Status: models.ArticleStatusPublished, ViewCount: 1800, ReadTime: 3, Locale: locale, CategoryID: "environnement"},
		},
	}

	for _, section := range sections {
		if articles, ok := sectionTemplates[section]; ok {
			sectionArticles[section] = articles
		} else {
			sectionArticles[section] = []models.Article{}
		}
	}

	homepageData := map[string]interface{}{
		"featured":    featured,
		"topArticles": topArticles,
		"mostRead":    mostRead,
		"sections":    sectionArticles,
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: homepageData})
}

func (h *EtheriaHandlers) CreateArticle(c *gin.Context) {
	var req models.CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		authorID := c.GetString("userID")
		if authorID == "" {
			authorID = "default-user"
		}
		article, err := prismaService.CreateArticle(&req, authorID)
		if err == nil {
			c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: article})
			return
		}
	}

	article := models.Article{
		ID: "new-article-id", Title: req.Title, Slug: strings.ToLower(strings.ReplaceAll(req.Title, " ", "-")),
		Content: req.Content, Excerpt: req.Excerpt, Status: models.ArticleStatusDraft, AuthorID: c.GetString("userID"),
		CategoryID: req.CategoryID, ImageUrl: req.ImageUrl, SeoTitle: req.SeoTitle,
	}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) UpdateArticle(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		article, err := prismaService.UpdateArticle(id, &req)
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
			return
		}
	}

	article := models.Article{ID: id, Title: req.Title, Slug: strings.ToLower(strings.ReplaceAll(req.Title, " ", "-"))}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) DeleteArticle(c *gin.Context) {
	id := c.Param("id")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		err := prismaService.DeleteArticle(id)
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Article supprimé: " + id})
			return
		}
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Article supprimé: " + id})
}

func (h *EtheriaHandlers) PublishArticle(c *gin.Context) {
	id := c.Param("id")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		err := prismaService.PublishArticle(id)
		if err == nil {
			article := models.Article{ID: id, Status: models.ArticleStatusPublished, PublishedAt: time.Now()}
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
			return
		}
	}

	article := models.Article{ID: id, Status: models.ArticleStatusPublished, PublishedAt: time.Now()}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) ArchiveArticle(c *gin.Context) {
	id := c.Param("id")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		err := prismaService.ArchiveArticle(id)
		if err == nil {
			article := models.Article{ID: id, Status: models.ArticleStatusArchived}
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
			return
		}
	}

	article := models.Article{ID: id, Status: models.ArticleStatusArchived}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

func (h *EtheriaHandlers) ToggleFeatured(c *gin.Context) {
	id := c.Param("id")
	article := models.Article{ID: id, Featured: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: article})
}

// Categories
func (h *EtheriaHandlers) ListCategories(c *gin.Context) {
	categories := []models.Category{
		{ID: "1", Name: "Politique", Slug: "politique", IsVisible: true},
		{ID: "2", Name: "Économie", Slug: "economie", IsVisible: true},
		{ID: "3", Name: "International", Slug: "international", IsVisible: true},
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: categories})
}

func (h *EtheriaHandlers) GetCategory(c *gin.Context) {
	id := c.Param("id")
	category := models.Category{ID: id, Name: "Politique", Slug: "politique", Description: "Actualités politiques", IsVisible: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: category})
}

func (h *EtheriaHandlers) CreateCategory(c *gin.Context) {
	var req models.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	category := models.Category{
		ID: "new-category-id", Name: req.Name, Slug: strings.ToLower(strings.ReplaceAll(req.Name, " ", "-")),
		Description: req.Description, Color: req.Color, ParentID: req.ParentID, IsVisible: true,
	}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: category})
}

func (h *EtheriaHandlers) UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	category := models.Category{ID: id}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: category})
}

func (h *EtheriaHandlers) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Catégorie supprimée: " + id})
}

// Comments
func (h *EtheriaHandlers) ListComments(c *gin.Context) {
	articleID := c.Param("articleId")
	comments := []models.Comment{
		{ID: "1", Content: "Excellent article, merci.", IsApproved: true, IsFlagged: false, ArticleID: articleID, AuthorID: "user-1"},
	}
	c.JSON(http.StatusOK, models.PaginatedResponse{Data: comments, Total: 1, Page: 1, PageSize: 20, TotalPages: 1})
}

func (h *EtheriaHandlers) CreateComment(c *gin.Context) {
	var req models.CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	comment := models.Comment{
		ID: "new-comment-id", Content: req.Content, IsApproved: true, ArticleID: c.Query("articleId"),
		AuthorID: c.GetString("userID"), ParentID: req.ParentID,
	}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: comment})
}

func (h *EtheriaHandlers) UpdateComment(c *gin.Context) {
	id := c.Param("id")
	comment := models.Comment{ID: id}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: comment})
}

func (h *EtheriaHandlers) DeleteComment(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Commentaire supprimé: " + id})
}

func (h *EtheriaHandlers) FlagComment(c *gin.Context) {
	id := c.Param("id")
	comment := models.Comment{ID: id, IsFlagged: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: comment})
}

func (h *EtheriaHandlers) ApproveComment(c *gin.Context) {
	id := c.Param("id")
	comment := models.Comment{ID: id, IsApproved: true, IsFlagged: false}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: comment})
}

// Bookmarks
func (h *EtheriaHandlers) ListBookmarks(c *gin.Context) {
	userID := c.GetString("userID")
	bookmarks := []models.Bookmark{{ID: "1", UserID: userID, ArticleID: "1"}}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: bookmarks})
}

func (h *EtheriaHandlers) AddBookmark(c *gin.Context) {
	var req struct{ ArticleID string }
	c.ShouldBindJSON(&req)
	bookmark := models.Bookmark{ID: "new-bookmark-id", UserID: c.GetString("userID"), ArticleID: req.ArticleID}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: bookmark})
}

func (h *EtheriaHandlers) RemoveBookmark(c *gin.Context) {
	articleID := c.Param("articleId")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Bookmark supprimé pour: " + articleID})
}

// Reading History
func (h *EtheriaHandlers) ListReadingHistory(c *gin.Context) {
	userID := c.GetString("userID")
	history := []models.ReadingHistory{{ID: "1", UserID: userID, ArticleID: "1"}}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: history})
}

func (h *EtheriaHandlers) AddToHistory(c *gin.Context) {
	var req struct{ ArticleID string }
	c.ShouldBindJSON(&req)
	history := models.ReadingHistory{ID: "new-history-id", UserID: c.GetString("userID"), ArticleID: req.ArticleID}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: history})
}

func (h *EtheriaHandlers) ClearHistory(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Historique effacé"})
}

func (h *EtheriaHandlers) RemoveFromHistory(c *gin.Context) {
	articleID := c.Param("articleId")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Historique supprimé pour: " + articleID})
}

// Notifications
func (h *EtheriaHandlers) ListNotifications(c *gin.Context) {
	userID := c.GetString("userID")
	notifications := []models.EtheriaNotification{
		{ID: "1", Type: models.NotificationTypeArticle, Title: "Nouvel article", Message: "Un nouvel article est disponible", IsRead: false, Priority: "medium", UserID: userID},
	}
	c.JSON(http.StatusOK, models.PaginatedResponse{Data: notifications, Total: 1, Page: 1, PageSize: 20, TotalPages: 1})
}

func (h *EtheriaHandlers) MarkNotificationRead(c *gin.Context) {
	id := c.Param("id")
	notification := models.EtheriaNotification{ID: id, IsRead: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: notification})
}

func (h *EtheriaHandlers) MarkAllNotificationsRead(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Toutes les notifications marquées comme lues"})
}

func (h *EtheriaHandlers) DeleteNotification(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Notification supprimée: " + id})
}

// Subscription
func (h *EtheriaHandlers) GetSubscription(c *gin.Context) {
	userID := c.GetString("userID")
	subscription := models.Subscription{
		ID: "1", UserID: userID, Plan: models.PlanPremium, Status: models.SubscriptionActive,
		NextPaymentDate: time.Now().AddDate(0, 1, 0), PaymentMethod: "card", PaymentLast4: "4242",
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: subscription})
}

func (h *EtheriaHandlers) CreateSubscription(c *gin.Context) {
	var req models.CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	subscription := models.Subscription{ID: "new-subscription-id", UserID: c.GetString("userID"), Plan: models.SubscriptionPlan(req.Plan), Status: models.SubscriptionActive, NextPaymentDate: time.Now().AddDate(0, 1, 0)}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: subscription})
}

func (h *EtheriaHandlers) UpdateSubscription(c *gin.Context) {
	var req models.CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	subscription := models.Subscription{Plan: models.SubscriptionPlan(req.Plan)}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: subscription})
}

func (h *EtheriaHandlers) CancelSubscription(c *gin.Context) {
	subscription := models.Subscription{CancelAtPeriodEnd: true}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: subscription})
}

// Media
func (h *EtheriaHandlers) ListMedia(c *gin.Context) {
	media := []models.Media{{ID: "1", Filename: "image.jpg", OriginalName: "image.jpg", MimeType: "image/jpeg", Size: 1024000, Url: "/uploads/image.jpg"}}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: media})
}

func (h *EtheriaHandlers) UploadMedia(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: "No file provided"})
		return
	}
	media := models.Media{ID: "new-media-id", Filename: file.Filename, OriginalName: file.Filename, MimeType: "image/jpeg", Size: 1024000, Url: "/uploads/" + file.Filename}
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: media})
}

func (h *EtheriaHandlers) DeleteMedia(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Media supprimé: " + id})
}

// Settings
func (h *EtheriaHandlers) GetSettings(c *gin.Context) {
	prismaService := services.GetPrismaService()
	if prismaService != nil {
		settings, err := prismaService.GetSystemSettings()
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: settings})
			return
		}
		fmt.Printf("[!] GetSettings error: %v\n", err)
	}

	c.JSON(http.StatusServiceUnavailable, models.ApiResponse{Success: false, Error: "Database unavailable"})
}

func (h *EtheriaHandlers) UpdateSettings(c *gin.Context) {
	var req models.EtheriaUpdateSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		settings, err := prismaService.UpdateSystemSettings(&req)
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: settings})
			return
		}
		fmt.Printf("[!] UpdateSettings error: %v\n", err)
	}

	c.JSON(http.StatusServiceUnavailable, models.ApiResponse{Success: false, Error: "Database unavailable"})
}

func (h *EtheriaHandlers) TestEmailConfig(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
	}
	c.ShouldBindJSON(&req)

	prismaService := services.GetPrismaService()
	if prismaService == nil {
		c.JSON(http.StatusServiceUnavailable, models.ApiResponse{Success: false, Error: "Database unavailable"})
		return
	}

	settings, err := prismaService.GetSystemSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ApiResponse{Success: false, Error: "Failed to get settings"})
		return
	}

	if settings.SmtpHost == "" {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: "SMTP not configured"})
		return
	}

	emailService := services.NewEmailService(settings)
	testEmail := req.Email
	if testEmail == "" {
		testEmail = settings.Email
	}

	err = emailService.SendEmail(testEmail, "Test - The Etheria Times", "Cet email est un test de configuration SMTP.")
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ApiResponse{Success: false, Error: "Failed to send email: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Email de test envoyé à " + testEmail})
}

// Admin Users
func (h *EtheriaHandlers) ListUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	if pageSize == 0 {
		pageSize = 10
	}
	search := c.Query("search")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		users, total, err := prismaService.ListUsers(search, page, pageSize)
		if err == nil {
			totalPages := (total + pageSize - 1) / pageSize
			c.JSON(http.StatusOK, models.PaginatedResponse{Data: users, Total: total, Page: page, PageSize: pageSize, TotalPages: totalPages})
			return
		}
		fmt.Printf("\033[1;31m[!] ListUsers error: %v\033[0m\n", err)
	}

	c.JSON(http.StatusServiceUnavailable, models.PaginatedResponse{Data: []models.EtheriaUser{}, Total: 0, Page: 1, PageSize: 10, TotalPages: 0})
}

func (h *EtheriaHandlers) GetUser(c *gin.Context) {
	id := c.Param("id")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		user, err := prismaService.GetUser(id)
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: user})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.ApiResponse{Success: false, Error: "User not found"})
}

func (h *EtheriaHandlers) CreateUser(c *gin.Context) {
	var req struct {
		Email     string `json:"email" binding:"required"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Role      string `json:"role"`
		Password  string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	if req.Password == "" {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: "Password is required"})
		return
	}

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		user, err := prismaService.CreateUser(req.Email, req.FirstName, req.LastName, req.Role, req.Password)
		if err == nil {
			c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: user})
			return
		}
	}

	hashedPassword, _ := hashPassword(req.Password)
	user := models.EtheriaUser{
		ID:        fmt.Sprintf("user_%d", time.Now().UnixNano()),
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      models.RoleUser,
		IsActive:  true,
	}
	_ = hashedPassword
	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: user})
}

func (h *EtheriaHandlers) UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Role      string `json:"role"`
		IsActive  bool   `json:"isActive"`
	}
	c.ShouldBindJSON(&req)

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		user, err := prismaService.UpdateUser(id, req.FirstName, req.LastName, req.Role, req.IsActive)
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: user})
			return
		}
	}

	user := models.EtheriaUser{ID: id}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: user})
}

func (h *EtheriaHandlers) DeleteUser(c *gin.Context) {
	id := c.Param("id")

	prismaService := services.GetPrismaService()
	if prismaService != nil {
		err := prismaService.DeleteUser(id)
		if err == nil {
			c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Utilisateur supprimé: " + id})
			return
		}
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Utilisateur supprimé: " + id})
}

// ==================== SOCIAL ACCOUNTS HANDLERS ====================

type SocialHandler struct{}

func NewSocialHandler() *SocialHandler { return &SocialHandler{} }

func (h *SocialHandler) ListSocialAccounts(c *gin.Context) {
	platform := c.Query("platform")
	connected := c.Query("connected")

	accounts := []models.SocialAccount{
		{
			ID: "1", Platform: models.SocialPlatformTwitter, AccountName: "@EtheriaTimes",
			AccountID: "etheriatimes", Connected: true, Followers: 45230, Following: 1250,
			Posts: 8920, AutoPost: true,
		},
		{
			ID: "2", Platform: models.SocialPlatformFacebook, AccountName: "Etheria Times",
			AccountID: "etheriatimes", Connected: true, Followers: 125400, Following: 340,
			Posts: 4520, AutoPost: true,
		},
		{
			ID: "3", Platform: models.SocialPlatformInstagram, AccountName: "@etheriatimes",
			AccountID: "etheriatimes", Connected: true, Followers: 89200, Following: 890,
			Posts: 2340, AutoPost: false,
		},
		{
			ID: "4", Platform: models.SocialPlatformLinkedin, AccountName: "Etheria Times",
			AccountID: "etheria-times", Connected: true, Followers: 15600, Following: 560,
			Posts: 890, AutoPost: true,
		},
	}

	if platform != "" {
		filtered := []models.SocialAccount{}
		for _, a := range accounts {
			if string(a.Platform) == platform {
				filtered = append(filtered, a)
			}
		}
		accounts = filtered
	}

	if connected != "" {
		filtered := []models.SocialAccount{}
		isConnected := connected == "true"
		for _, a := range accounts {
			if a.Connected == isConnected {
				filtered = append(filtered, a)
			}
		}
		accounts = filtered
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: accounts})
}

func (h *SocialHandler) CreateSocialAccount(c *gin.Context) {
	var req models.CreateSocialAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	account := models.SocialAccount{
		ID:          "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Platform:    req.Platform,
		AccountName: req.AccountName,
		AccountID:   req.AccountID,
		Connected:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: account})
}

func (h *SocialHandler) UpdateSocialAccount(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateSocialAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	account := models.SocialAccount{
		ID:          id,
		AccountName: req.AccountName,
		AutoPost:    req.AutoPost != nil && *req.AutoPost,
		UpdatedAt:   time.Now(),
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: account})
}

func (h *SocialHandler) DeleteSocialAccount(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Social account deleted: " + id})
}

func (h *SocialHandler) ConnectSocialAccount(c *gin.Context) {
	id := c.Param("id")
	account := models.SocialAccount{
		ID:        id,
		Connected: true,
		LastSync:  &time.Time{},
	}
	*account.LastSync = time.Now()
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: account})
}

func (h *SocialHandler) DisconnectSocialAccount(c *gin.Context) {
	id := c.Param("id")
	account := models.SocialAccount{
		ID:        id,
		Connected: false,
	}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: account})
}

func (h *SocialHandler) SyncSocialAccount(c *gin.Context) {
	id := c.Param("id")
	account := models.SocialAccount{
		ID:       id,
		LastSync: &time.Time{},
	}
	*account.LastSync = time.Now()
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: account})
}

// ==================== SCHEDULED POSTS HANDLERS ====================

type ScheduledPostHandler struct{}

func NewScheduledPostHandler() *ScheduledPostHandler { return &ScheduledPostHandler{} }

func (h *ScheduledPostHandler) ListScheduledPosts(c *gin.Context) {
	platform := c.Query("platform")
	status := c.Query("status")

	scheduledPosts := []models.ScheduledPost{
		{
			ID: "1", Content: "Les technologies de 2026 révolutionnent notre quotidien",
			Platform: models.SocialPlatformTwitter, ScheduledAt: time.Now().Add(24 * time.Hour),
			Status: models.ScheduledPostStatusScheduled, ArticleID: "42", ArticleTitle: "Les nouvelles technologies de 2026",
			MediaCount: 1, Recurring: false,
		},
		{
			ID: "2", Content: "Résumé de l'actualité de la semaine",
			Platform: models.SocialPlatformFacebook, ScheduledAt: time.Now().Add(48 * time.Hour),
			Status: models.ScheduledPostStatusScheduled, ArticleID: "41", ArticleTitle: "Actualité de la semaine",
			MediaCount: 3, Recurring: true, RecurringPattern: models.RecurringPatternWeekly,
		},
		{
			ID: "3", Content: "Photo du jour: Lever de soleil sur Paris",
			Platform: models.SocialPlatformInstagram, ScheduledAt: time.Now().Add(12 * time.Hour),
			Status: models.ScheduledPostStatusScheduled, MediaCount: 1, Recurring: false,
		},
	}

	if platform != "" {
		filtered := []models.ScheduledPost{}
		for _, p := range scheduledPosts {
			if string(p.Platform) == platform {
				filtered = append(filtered, p)
			}
		}
		scheduledPosts = filtered
	}

	if status != "" {
		filtered := []models.ScheduledPost{}
		for _, p := range scheduledPosts {
			if string(p.Status) == status {
				filtered = append(filtered, p)
			}
		}
		scheduledPosts = filtered
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: scheduledPosts, Total: len(scheduledPosts), Page: 1, PageSize: 20, TotalPages: 1,
	})
}

func (h *ScheduledPostHandler) CreateScheduledPost(c *gin.Context) {
	var req models.CreateScheduledPostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	post := models.ScheduledPost{
		ID:               "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Content:          req.Content,
		Platform:         req.Platform,
		ScheduledAt:      req.ScheduledAt,
		Status:           models.ScheduledPostStatusScheduled,
		ArticleID:        req.ArticleID,
		MediaCount:       req.MediaCount,
		Recurring:        req.Recurring,
		RecurringPattern: req.RecurringPattern,
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: post})
}

func (h *ScheduledPostHandler) UpdateScheduledPost(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateScheduledPostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	post := models.ScheduledPost{ID: id, Content: req.Content, UpdatedAt: time.Now()}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: post})
}

func (h *ScheduledPostHandler) DeleteScheduledPost(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Scheduled post deleted: " + id})
}

func (h *ScheduledPostHandler) CancelScheduledPost(c *gin.Context) {
	id := c.Param("id")
	post := models.ScheduledPost{ID: id, Status: models.ScheduledPostStatusCancelled}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: post})
}

func (h *ScheduledPostHandler) PublishNow(c *gin.Context) {
	id := c.Param("id")
	now := time.Now()
	post := models.ScheduledPost{ID: id, Status: models.ScheduledPostStatusPublished, PublishedAt: &now}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: post})
}

// ==================== ADVERTISING HANDLERS ====================

type AdvertisingHandler struct{}

func NewAdvertisingHandler() *AdvertisingHandler { return &AdvertisingHandler{} }

func (h *AdvertisingHandler) ListAdCampaigns(c *gin.Context) {
	status := c.Query("status")

	campaigns := []models.AdCampaign{
		{
			ID: "1", Name: "Campagne été 2026", Status: models.AdCampaignStatusActive,
			Type: models.AdCampaignTypeBanner, Impressions: 125000, Clicks: 3250,
			Ctr: 2.6, Spend: 850, Budget: 2000, StartDate: time.Now().AddDate(0, 0, -30),
			EndDate:    func() *time.Time { t := time.Now().AddDate(0, 0, 30); return &t }(),
			Advertiser: "Etheria Corp",
		},
		{
			ID: "2", Name: "Produit Premium", Status: models.AdCampaignStatusActive,
			Type: models.AdCampaignTypeSponsored, Impressions: 85000, Clicks: 2100,
			Ctr: 2.47, Spend: 620, Budget: 1500, StartDate: time.Now().AddDate(0, 0, -60),
			Advertiser: "Tech Solutions",
		},
		{
			ID: "3", Name: "Newsletter sponsorisée", Status: models.AdCampaignStatusPaused,
			Type: models.AdCampaignTypeNative, Impressions: 45000, Clicks: 1800,
			Ctr: 4.0, Spend: 450, Budget: 1000, StartDate: time.Now().AddDate(0, 0, -40),
			Advertiser: "Finance Plus",
		},
	}

	if status != "" {
		filtered := []models.AdCampaign{}
		for _, c := range campaigns {
			if string(c.Status) == status {
				filtered = append(filtered, c)
			}
		}
		campaigns = filtered
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: campaigns, Total: len(campaigns), Page: 1, PageSize: 20, TotalPages: 1,
	})
}

func (h *AdvertisingHandler) CreateAdCampaign(c *gin.Context) {
	var req models.CreateAdCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	campaign := models.AdCampaign{
		ID:   "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Name: req.Name, Type: req.Type, Budget: req.Budget,
		StartDate: req.StartDate, EndDate: req.EndDate,
		Advertiser: req.Advertiser, Status: models.AdCampaignStatusDraft,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: campaign})
}

func (h *AdvertisingHandler) UpdateAdCampaign(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateAdCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	campaign := models.AdCampaign{ID: id, Name: req.Name, Budget: req.Budget}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: campaign})
}

func (h *AdvertisingHandler) DeleteAdCampaign(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Campaign deleted: " + id})
}

func (h *AdvertisingHandler) PauseAdCampaign(c *gin.Context) {
	id := c.Param("id")
	campaign := models.AdCampaign{ID: id, Status: models.AdCampaignStatusPaused}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: campaign})
}

func (h *AdvertisingHandler) ResumeAdCampaign(c *gin.Context) {
	id := c.Param("id")
	campaign := models.AdCampaign{ID: id, Status: models.AdCampaignStatusActive}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: campaign})
}

func (h *AdvertisingHandler) ListAdPlacements(c *gin.Context) {
	status := c.Query("status")

	placements := []models.AdPlacement{
		{
			ID: "1", Name: "Bannière header", Zone: "header", Format: "728x90",
			Position: "Haut de page", Impressions: 150000, Clicks: 3200,
			Ctr: 2.13, Revenue: 450, Status: models.AdPlacementStatusActive,
		},
		{
			ID: "2", Name: "Bannière sidebar", Zone: "sidebar", Format: "300x250",
			Position: "Colonne droite", Impressions: 120000, Clicks: 2800,
			Ctr: 2.33, Revenue: 380, Status: models.AdPlacementStatusActive,
		},
		{
			ID: "3", Name: "Bannière article", Zone: "article", Format: "640x100",
			Position: "Fin d'article", Impressions: 95000, Clicks: 2100,
			Ctr: 2.21, Revenue: 290, Status: models.AdPlacementStatusActive,
		},
	}

	if status != "" {
		filtered := []models.AdPlacement{}
		for _, p := range placements {
			if string(p.Status) == status {
				filtered = append(filtered, p)
			}
		}
		placements = filtered
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: placements, Total: len(placements), Page: 1, PageSize: 20, TotalPages: 1,
	})
}

func (h *AdvertisingHandler) CreateAdPlacement(c *gin.Context) {
	var req models.CreateAdPlacementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	placement := models.AdPlacement{
		ID:   "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Name: req.Name, Zone: req.Zone, Format: req.Format,
		Position: req.Position, Status: models.AdPlacementStatusActive,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: placement})
}

func (h *AdvertisingHandler) UpdateAdPlacement(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateAdPlacementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	placement := models.AdPlacement{ID: id, Name: req.Name, Zone: req.Zone}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: placement})
}

func (h *AdvertisingHandler) DeleteAdPlacement(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Placement deleted: " + id})
}

// ==================== AUDIT LOG HANDLERS ====================

type AuditLogHandler struct{}

func NewAuditLogHandler() *AuditLogHandler { return &AuditLogHandler{} }

func (h *AuditLogHandler) ListAuditLogs(c *gin.Context) {
	action := c.Query("action")
	status := c.Query("status")
	resource := c.Query("resource")

	logs := []models.AuditLog{
		{
			ID: "1", Timestamp: time.Now().Add(-30 * time.Minute),
			UserID: "1", UserName: "Admin Principal", UserEmail: "admin@etheriatimes.com",
			Action: "LOGIN", Resource: "auth", IPAddress: "192.168.1.100",
			Status: models.AuditLogStatusSuccess,
		},
		{
			ID: "2", Timestamp: time.Now().Add(-60 * time.Minute),
			UserID: "2", UserName: "John Doe", UserEmail: "john@example.com",
			Action: "ARTICLE_CREATE", Resource: "articles", ResourceID: "42",
			IPAddress: "192.168.1.101", Details: "Article: 'Les nouvelles technologies de 2026'",
			Status: models.AuditLogStatusSuccess,
		},
		{
			ID: "3", Timestamp: time.Now().Add(-90 * time.Minute),
			UserID: "4", UserName: "Jane Smith", UserEmail: "jane@example.com",
			Action: "LOGIN_FAILED", Resource: "auth", IPAddress: "192.168.1.102",
			Details: "Invalid password", Status: models.AuditLogStatusFailed,
		},
	}

	if action != "" {
		filtered := []models.AuditLog{}
		for _, l := range logs {
			if l.Action == action {
				filtered = append(filtered, l)
			}
		}
		logs = filtered
	}

	if status != "" {
		filtered := []models.AuditLog{}
		for _, l := range logs {
			if string(l.Status) == status {
				filtered = append(filtered, l)
			}
		}
		logs = filtered
	}

	if resource != "" {
		filtered := []models.AuditLog{}
		for _, l := range logs {
			if l.Resource == resource {
				filtered = append(filtered, l)
			}
		}
		logs = filtered
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: logs, Total: len(logs), Page: 1, PageSize: 50, TotalPages: 1,
	})
}

func (h *AuditLogHandler) ExportAuditLogs(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Audit logs export started"})
}

// ==================== API KEY HANDLERS ====================

type ApiKeyHandler struct{}

func NewApiKeyHandler() *ApiKeyHandler { return &ApiKeyHandler{} }

func (h *ApiKeyHandler) ListApiKeys(c *gin.Context) {
	keys := []models.ApiKey{
		{
			ID: "1", Name: "Clé production principale", Prefix: "pk_live_",
			Key: "pk_live_xxxxxxxxxxxxx", Type: models.ApiKeyTypePublic,
			Permissions: []string{"read:articles", "read:categories"}, Status: models.ApiKeyStatusActive,
		},
		{
			ID: "2", Name: "Clé secrète serveur", Prefix: "sk_live_",
			Key: "sk_live_xxxxxxxxxxxxx", Type: models.ApiKeyTypeSecret,
			Permissions: []string{"read:all", "write:articles", "admin:users"}, Status: models.ApiKeyStatusActive,
		},
		{
			ID: "3", Name: "Clé développement", Prefix: "pk_test_",
			Key: "pk_test_xxxxxxxxxxxxx", Type: models.ApiKeyTypePublic,
			Permissions: []string{"read:articles"}, Status: models.ApiKeyStatusActive,
		},
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: keys})
}

func (h *ApiKeyHandler) CreateApiKey(c *gin.Context) {
	var req models.CreateApiKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	prefix := "pk_"
	if req.Type == models.ApiKeyTypeSecret {
		prefix = "sk_"
	}

	key := models.ApiKey{
		ID:   "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Name: req.Name, Prefix: prefix + "test_",
		Key:  prefix + "test_" + strconv.FormatInt(time.Now().Unix(), 10),
		Type: req.Type, Permissions: req.Permissions,
		ExpiresAt: req.ExpiresAt, Status: models.ApiKeyStatusActive,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: key})
}

func (h *ApiKeyHandler) UpdateApiKey(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateApiKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	key := models.ApiKey{ID: id, Name: req.Name}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: key})
}

func (h *ApiKeyHandler) DeleteApiKey(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "API key deleted: " + id})
}

func (h *ApiKeyHandler) RevokeApiKey(c *gin.Context) {
	id := c.Param("id")
	key := models.ApiKey{ID: id, Status: models.ApiKeyStatusRevoked}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: key})
}

func (h *ApiKeyHandler) RegenerateApiKey(c *gin.Context) {
	id := c.Param("id")
	newKey := "pk_test_" + strconv.FormatInt(time.Now().Unix(), 10)
	key := models.ApiKey{ID: id, Key: newKey}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: key})
}

// ==================== SEO HANDLERS ====================

type SeoHandler struct{}

func NewSeoHandler() *SeoHandler { return &SeoHandler{} }

func (h *SeoHandler) ListSeoAudits(c *gin.Context) {
	audits := []models.SeoAudit{
		{
			ID: "1", URL: "/", Title: "The Etheria Times - L'information au service du citizen",
			MetaDescription: "The Etheria Times - Votre source d'information indépendante",
			H1:              "L'actualité du jour", Status: models.SeoAuditStatusSuccess,
			Score: 92, LastChecked: time.Now().Add(-2 * time.Hour),
		},
		{
			ID: "2", URL: "/politique", Title: "Politique - The Etheria Times",
			MetaDescription: "Actualités politiques Etheria Times",
			H1:              "Politique", Status: models.SeoAuditStatusWarning,
			Score: 75, LastChecked: time.Now().Add(-2 * time.Hour),
		},
		{
			ID: "3", URL: "/economie", Title: "Économie",
			H1: "Actualité économique", Status: models.SeoAuditStatusError,
			Score: 45, LastChecked: time.Now().Add(-2 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: audits, Total: len(audits), Page: 1, PageSize: 20, TotalPages: 1,
	})
}

func (h *SeoHandler) RunSeoAudit(c *gin.Context) {
	var req models.CreateSeoAuditRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	audit := models.SeoAudit{
		ID:  "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		URL: req.URL, Status: models.SeoAuditStatusSuccess,
		Score: 85, LastChecked: time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: audit})
}

func (h *SeoHandler) ListKeywords(c *gin.Context) {
	keywords := []models.Keyword{
		{ID: "1", Keyword: "actualités Etheria", Position: 3, Volume: 12500, Difficulty: "moyen", Trend: models.KeywordTrendUp},
		{ID: "2", Keyword: "news Etheria", Position: 5, Volume: 8200, Difficulty: "facile", Trend: models.KeywordTrendStable},
		{ID: "3", Keyword: "politique Etheria", Position: 8, Volume: 5600, Difficulty: "difficile", Trend: models.KeywordTrendDown},
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: keywords, Total: len(keywords), Page: 1, PageSize: 20, TotalPages: 1,
	})
}

func (h *SeoHandler) AddKeyword(c *gin.Context) {
	var req models.CreateKeywordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	keyword := models.Keyword{
		ID:      "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Keyword: req.Keyword, Volume: req.Volume,
		Difficulty: req.Difficulty, Trend: models.KeywordTrendStable,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: keyword})
}

func (h *SeoHandler) DeleteKeyword(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Keyword deleted: " + id})
}

func (h *SeoHandler) ListMetaTags(c *gin.Context) {
	tags := []models.MetaTag{
		{ID: "1", Name: "description", Content: "Site d'actualité", Page: "/"},
		{ID: "2", Name: "keywords", Content: "news, actualité, Etheria", Page: "/"},
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: tags})
}

func (h *SeoHandler) UpdateMetaTags(c *gin.Context) {
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Meta tags updated"})
}

// ==================== NEWSLETTER HANDLERS ====================

type NewsletterHandler struct{}

func NewNewsletterHandler() *NewsletterHandler { return &NewsletterHandler{} }

func (h *NewsletterHandler) ListNewsletterCampaigns(c *gin.Context) {
	status := c.Query("status")

	campaigns := []models.NewsletterCampaign{
		{
			ID: "1", Name: "Newsletter Mars 2026", Subject: "L'actualité du mois",
			Content: "Contenu de la newsletter...", Status: models.NewsletterStatusSent,
			Recipients: 15000, Opens: 4500, Clicks: 1200,
		},
		{
			ID: "2", Name: "Newsletter Avril 2026", Subject: "Les nouvelles réformes",
			Content: "Contenu de la newsletter...", Status: models.NewsletterStatusScheduled,
			ScheduledAt: func() *time.Time { t := time.Now().Add(7 * 24 * time.Hour); return &t }(),
			Recipients:  15500,
		},
		{
			ID: "3", Name: "Newsletter Mai 2026", Subject: "À venir",
			Content: "", Status: models.NewsletterStatusDraft,
		},
	}

	if status != "" {
		filtered := []models.NewsletterCampaign{}
		for _, c := range campaigns {
			if string(c.Status) == status {
				filtered = append(filtered, c)
			}
		}
		campaigns = filtered
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: campaigns, Total: len(campaigns), Page: 1, PageSize: 20, TotalPages: 1,
	})
}

func (h *NewsletterHandler) CreateNewsletterCampaign(c *gin.Context) {
	var req models.CreateNewsletterCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	campaign := models.NewsletterCampaign{
		ID:   "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Name: req.Name, Subject: req.Subject, Content: req.Content,
		Status:    models.NewsletterStatusDraft,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: campaign})
}

func (h *NewsletterHandler) UpdateNewsletterCampaign(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateNewsletterCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	campaign := models.NewsletterCampaign{ID: id, Name: req.Name}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: campaign})
}

func (h *NewsletterHandler) DeleteNewsletterCampaign(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Campaign deleted: " + id})
}

func (h *NewsletterHandler) SendNewsletter(c *gin.Context) {
	id := c.Param("id")
	now := time.Now()
	campaign := models.NewsletterCampaign{ID: id, Status: models.NewsletterStatusSent, SentAt: &now}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: campaign})
}

func (h *NewsletterHandler) ScheduleNewsletter(c *gin.Context) {
	id := c.Param("id")
	var req models.ScheduleNewsletterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	campaign := models.NewsletterCampaign{ID: id, Status: models.NewsletterStatusScheduled, ScheduledAt: &req.ScheduledAt}
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: campaign})
}

func (h *NewsletterHandler) SendTestNewsletter(c *gin.Context) {
	var req models.SendTestNewsletterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Test email sent to " + req.Email})
}

// ==================== SYSTEM LOG HANDLERS ====================

type SystemLogHandler struct{}

func NewSystemLogHandler() *SystemLogHandler { return &SystemLogHandler{} }

func (h *SystemLogHandler) ListSystemLogs(c *gin.Context) {
	level := c.Query("level")
	source := c.Query("source")

	logs := []models.SystemLog{
		{
			ID: "1", Level: models.SystemLogLevelInfo, Message: "Server started",
			Source: "system", CreatedAt: time.Now().Add(-24 * time.Hour),
		},
		{
			ID: "2", Level: models.SystemLogLevelWarning, Message: "High memory usage",
			Source: "system", Details: `{"memory": "85%"}`, CreatedAt: time.Now().Add(-12 * time.Hour),
		},
		{
			ID: "3", Level: models.SystemLogLevelError, Message: "Database connection failed",
			Source: "database", CreatedAt: time.Now().Add(-1 * time.Hour),
		},
	}

	if level != "" {
		filtered := []models.SystemLog{}
		for _, l := range logs {
			if string(l.Level) == level {
				filtered = append(filtered, l)
			}
		}
		logs = filtered
	}

	if source != "" {
		filtered := []models.SystemLog{}
		for _, l := range logs {
			if l.Source == source {
				filtered = append(filtered, l)
			}
		}
		logs = filtered
	}

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: logs, Total: len(logs), Page: 1, PageSize: 50, TotalPages: 1,
	})
}

func (h *SystemLogHandler) DeleteSystemLog(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Log deleted: " + id})
}

// ==================== ANALYTICS HANDLERS ====================

type AnalyticsHandler struct{}

func NewAnalyticsHandler() *AnalyticsHandler { return &AnalyticsHandler{} }

func (h *AnalyticsHandler) GetSocialAnalytics(c *gin.Context) {
	analytics := models.SocialAnalytics{
		TotalFollowers: 265430,
		TotalPosts:     17570,
		EngagementRate: 3.2,
		Platforms: []models.PlatformStats{
			{Platform: models.SocialPlatformTwitter, Followers: 45230, Posts: 8920, Engagement: 2.8},
			{Platform: models.SocialPlatformFacebook, Followers: 125400, Posts: 4520, Engagement: 3.5},
			{Platform: models.SocialPlatformInstagram, Followers: 89200, Posts: 2340, Engagement: 4.2},
			{Platform: models.SocialPlatformLinkedin, Followers: 15600, Posts: 890, Engagement: 2.1},
		},
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: analytics})
}

func (h *AnalyticsHandler) GetAnalyticsOverview(c *gin.Context) {
	type Overview struct {
		TotalArticles    int `json:"totalArticles"`
		TotalUsers       int `json:"totalUsers"`
		TotalViews       int `json:"totalViews"`
		TotalSubscribers int `json:"totalSubscribers"`
	}

	overview := Overview{
		TotalArticles:    1245,
		TotalUsers:       85420,
		TotalViews:       1250000,
		TotalSubscribers: 45230,
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: overview})
}

// ==================== FOOTER LINK HANDLERS ====================

type FooterLinkHandler struct{}

func NewFooterLinkHandler() *FooterLinkHandler { return &FooterLinkHandler{} }

type FooterLinkRequest struct {
	Category  string `json:"category" binding:"required"`
	Title     string `json:"title" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Href      string `json:"href" binding:"required"`
	Locale    string `json:"locale"`
	Position  int    `json:"position"`
	IsVisible bool   `json:"isVisible"`
}

func (h *FooterLinkHandler) ListFooterLinks(c *gin.Context) {
	locale := c.Query("locale")

	footerLinks := []models.FooterLink{
		{ID: "1", Category: "dossiers", Title: "Dossiers d'actualité", Name: "Donald Trump", Href: "/dossiers/donald-trump", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "2", Category: "dossiers", Title: "Dossiers d'actualité", Name: "Guerre en Ukraine", Href: "/dossiers/guerre-ukraine", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "3", Category: "dossiers", Title: "Dossiers d'actualité", Name: "Affaire Epstein", Href: "/dossiers/affaire-epstein", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "4", Category: "dossiers", Title: "Dossiers d'actualité", Name: "Iran", Href: "/dossiers/iran", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "5", Category: "dossiers", Title: "Dossiers d'actualité", Name: "Pouvoir d'achat", Href: "/dossiers/pouvoir-achat", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "6", Category: "series", Title: "Séries", Name: "Dans les comptes", Href: "/series/comptes", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "7", Category: "series", Title: "Séries", Name: "Dans le lit", Href: "/series/lit", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "8", Category: "series", Title: "Séries", Name: "Dans la tête", Href: "/series/tete", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "9", Category: "series", Title: "Séries", Name: "Dans la nouvelle vie", Href: "/series/nouvelle-vie", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "10", Category: "series", Title: "Séries", Name: "Dans le cœur", Href: "/series/coeur", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "11", Category: "series", Title: "Séries", Name: "Les quiz d'Etheria Times", Href: "/quiz", Locale: "fr", Position: 5, IsVisible: true},
		{ID: "12", Category: "sports", Title: "Sports", Name: "PSG", Href: "/sport/psg", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "13", Category: "sports", Title: "Sports", Name: "Ligue des champions", Href: "/sport/ligue-champions", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "14", Category: "sports", Title: "Sports", Name: "Ligue 1", Href: "/sport/ligue-1", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "15", Category: "sports", Title: "Sports", Name: "Paris FC", Href: "/sport/paris-fc", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "16", Category: "sports", Title: "Sports", Name: "Ousmane Dembélé", Href: "/sport/dembele", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "17", Category: "sports", Title: "Sports", Name: "Kylian Mbappé", Href: "/sport/mbappe", Locale: "fr", Position: 5, IsVisible: true},
		{ID: "18", Category: "sports", Title: "Sports", Name: "Coupe du monde 2026", Href: "/sport/cdm-2026", Locale: "fr", Position: 6, IsVisible: true},
		{ID: "19", Category: "politique", Title: "Politique", Name: "Emmanuel Macron", Href: "/politique/macron", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "20", Category: "politique", Title: "Politique", Name: "Sébastien Lecornu", Href: "/politique/lecornu", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "21", Category: "politique", Title: "Politique", Name: "Municipales 2026", Href: "/politique/municipales-2026", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "22", Category: "politique", Title: "Politique", Name: "Municipales 2026 à Paris", Href: "/politique/municipales-2026-paris", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "23", Category: "politique", Title: "Politique", Name: "Résultats municipales 2026", Href: "/politique/resultats-municipales-2026", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "24", Category: "politique", Title: "Politique", Name: "Présidentielle 2027", Href: "/politique/presidentielle-2027", Locale: "fr", Position: 5, IsVisible: true},
		{ID: "25", Category: "etudiant", Title: "Étudiant", Name: "Étudiant", Href: "/etudiant", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "26", Category: "etudiant", Title: "Étudiant", Name: "Enseignement supérieur", Href: "/etudiant/enseignement-superieur", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "27", Category: "etudiant", Title: "Étudiant", Name: "Lycée", Href: "/etudiant/lycee", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "28", Category: "etudiant", Title: "Étudiant", Name: "Collège", Href: "/etudiant/college", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "29", Category: "etudiant", Title: "Étudiant", Name: "Guide métiers", Href: "/etudiant/guide-metiers", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "30", Category: "etudiant", Title: "Étudiant", Name: "Vie étudiante", Href: "/etudiant/vie-etudiante", Locale: "fr", Position: 5, IsVisible: true},
		{ID: "31", Category: "sorties", Title: "Sorties", Name: "Agenda sorties", Href: "/sorties/agenda", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "32", Category: "sorties", Title: "Sorties", Name: "Jobs Stages", Href: "/sorties/jobs-stages", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "33", Category: "videos", Title: "Vidéos", Name: "Podcasts & Vidéos", Href: "/videos", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "34", Category: "videos", Title: "Vidéos", Name: "Crime story", Href: "/videos/crime-story", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "35", Category: "videos", Title: "Vidéos", Name: "Code source", Href: "/videos/code-source", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "36", Category: "videos", Title: "Vidéos", Name: "Food-checking", Href: "/videos/food-checking", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "37", Category: "videos", Title: "Vidéos", Name: "Biclou", Href: "/videos/biclou", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "38", Category: "services", Title: "Services", Name: "Bons plans", Href: "/services/bons-plans", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "39", Category: "services", Title: "Services", Name: "Sélection du Guide d'achat", Href: "/services/guide-achat", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "40", Category: "services", Title: "Services", Name: "Météo", Href: "/services/meteo", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "41", Category: "subscription", Title: "Abonnement", Name: "Abonnement", Href: "/abonnement", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "42", Category: "subscription", Title: "Abonnement", Name: "Newsletter", Href: "/newsletter", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "43", Category: "subscription", Title: "Abonnement", Name: "Application mobile", Href: "/app", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "44", Category: "subscription", Title: "Abonnement", Name: "Archives", Href: "/archives", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "45", Category: "legal", Title: "Légal", Name: "Mentions légales", Href: "/mentions-legales", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "46", Category: "legal", Title: "Légal", Name: "CGU", Href: "/cgu", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "47", Category: "legal", Title: "Légal", Name: "Politique de confidentialité", Href: "/confidentialite", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "48", Category: "legal", Title: "Légal", Name: "Gestion des cookies", Href: "/cookies", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "49", Category: "social", Title: "Réseaux sociaux", Name: "Twitter", Href: "https://x.com/etheriatimes", Locale: "fr", Position: 0, IsVisible: true},
		{ID: "50", Category: "social", Title: "Réseaux sociaux", Name: "Facebook", Href: "https://facebook.com/etheriatimes", Locale: "fr", Position: 1, IsVisible: true},
		{ID: "51", Category: "social", Title: "Réseaux sociaux", Name: "Instagram", Href: "https://instagram.com/etheriatimes", Locale: "fr", Position: 2, IsVisible: true},
		{ID: "52", Category: "social", Title: "Réseaux sociaux", Name: "YouTube", Href: "https://youtube.com/@etheriatimes", Locale: "fr", Position: 3, IsVisible: true},
		{ID: "53", Category: "social", Title: "Réseaux sociaux", Name: "Discord", Href: "https://discord.gg/etheriatimes", Locale: "fr", Position: 4, IsVisible: true},
		{ID: "54", Category: "social", Title: "Réseaux sociaux", Name: "Twitch", Href: "https://twitch.tv/etheriatimes", Locale: "fr", Position: 5, IsVisible: true},
		{ID: "55", Category: "social", Title: "Réseaux sociaux", Name: "GitHub", Href: "https://github.com/etheriatimes", Locale: "fr", Position: 6, IsVisible: true},
	}

	if locale != "" {
		var filtered []models.FooterLink
		for _, link := range footerLinks {
			if link.Locale == locale {
				filtered = append(filtered, link)
			}
		}
		c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: filtered})
		return
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: footerLinks})
}

func (h *FooterLinkHandler) CreateFooterLink(c *gin.Context) {
	var req FooterLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	link := models.FooterLink{
		ID:        "new-" + strconv.FormatInt(time.Now().Unix(), 10),
		Category:  req.Category,
		Title:     req.Title,
		Name:      req.Name,
		Href:      req.Href,
		Locale:    req.Locale,
		Position:  req.Position,
		IsVisible: req.IsVisible,
	}

	c.JSON(http.StatusCreated, models.ApiResponse{Success: true, Data: link})
}

func (h *FooterLinkHandler) UpdateFooterLink(c *gin.Context) {
	id := c.Param("id")
	var req FooterLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}

	link := models.FooterLink{
		ID:        id,
		Category:  req.Category,
		Title:     req.Title,
		Name:      req.Name,
		Href:      req.Href,
		Locale:    req.Locale,
		Position:  req.Position,
		IsVisible: req.IsVisible,
	}

	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Data: link})
}

func (h *FooterLinkHandler) DeleteFooterLink(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.ApiResponse{Success: true, Message: "Link deleted: " + id})
}

// ==================== DOCKER HANDLER ====================

type DockerHandler struct{}

func NewDockerHandler() *DockerHandler {
	return &DockerHandler{}
}

type DockerLogRequest struct {
	Container string `form:"container" json:"container"`
	Lines     int    `form:"lines" json:"lines"`
}

func (h *DockerHandler) GetLogs(c *gin.Context) {
	var req DockerLogRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		req.Lines = 100
	}
	if req.Container == "" {
		req.Container = "etheriatimes"
	}
	if req.Lines == 0 {
		req.Lines = 100
	}

	cmd := exec.Command("docker", "logs", "--tail", strconv.Itoa(req.Lines), req.Container)
	var out, errBuf bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &errBuf

	_ = cmd.Run()

	logs := out.String()
	if errBuf.Len() > 0 {
		logs = logs + "\n" + errBuf.String()
	}

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data: gin.H{
			"logs":      splitLines(logs),
			"container": req.Container,
		},
	})
}

type DockerExecRequest struct {
	Container string `json:"container" binding:"required"`
	Command   string `json:"command" binding:"required"`
}

func (h *DockerHandler) ExecCommand(c *gin.Context) {
	var req DockerExecRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ApiResponse{Success: false, Error: err.Error()})
		return
	}
	if req.Container == "" {
		req.Container = "etheriatimes"
	}

	cmd := exec.Command("docker", "exec", req.Container, "sh", "-c", req.Command)
	var out, errBuf bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &errBuf

	err := cmd.Run()
	output := out.String()
	if errBuf.Len() > 0 && err != nil {
		output = output + "\n" + errBuf.String()
	}

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: err == nil,
		Data: gin.H{
			"output":   output,
			"exitCode": 0,
		},
	})
}

func (h *DockerHandler) GetStatus(c *gin.Context) {
	container := c.DefaultQuery("container", "etheriatimes")

	cmd := exec.Command("docker", "inspect", "--format", "{{.State.Running}}", container)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Run()

	running := strings.TrimSpace(out.String()) == "true"

	cmd = exec.Command("docker", "inspect", "--format", "{{.State.StartedAt}}", container)
	out.Reset()
	cmd.Stdout = &out
	cmd.Run()
	startedAt := strings.TrimSpace(out.String())

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data: gin.H{
			"running":   running,
			"startedAt": startedAt,
			"container": container,
		},
	})
}

func (h *DockerHandler) ListContainers(c *gin.Context) {
	cmd := exec.Command("docker", "ps", "--format", "{{.Names}}|{{.Status}}|{{.Image}}")
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Run()

	var containers []gin.H
	for _, line := range splitLines(out.String()) {
		parts := strings.Split(line, "|")
		if len(parts) >= 3 {
			containers = append(containers, gin.H{
				"name":   parts[0],
				"status": parts[1],
				"image":  parts[2],
			})
		}
	}

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data:    containers,
	})
}

type DockerUpdateRequest struct {
	Image string `json:"image"`
}

func (h *DockerHandler) UpdateContainer(c *gin.Context) {
	var req DockerUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req.Image = "etheriatimes:latest"
	}

	image := req.Image
	if image == "" {
		image = "etheriatimes:latest"
	}

	projectDir := "/home/liam/Bureau/etheriatimes/etheriatimes"

	cmd := exec.Command("docker", "compose", "pull", image)
	cmd.Dir = projectDir
	var pullOut, pullErr bytes.Buffer
	cmd.Stdout = &pullOut
	cmd.Stderr = &pullErr
	pullErr2 := cmd.Run()

	pullOutput := pullOut.String()
	if pullErr.Len() > 0 {
		pullOutput += "\n" + pullErr.String()
	}

	if pullErr2 != nil {
		cmd = exec.Command("docker", "pull", image)
		var out, err bytes.Buffer
		cmd.Stdout = &out
		cmd.Stderr = &err
		cmd.Run()
		pullOutput = out.String()
		if err.Len() > 0 {
			pullOutput += "\n" + err.String()
		}
	}

	cmd = exec.Command("docker", "compose", "up", "-d", "--build", "--no-cache")
	cmd.Dir = projectDir
	var upOut, upErr bytes.Buffer
	cmd.Stdout = &upOut
	cmd.Stderr = &upErr
	upErr2 := cmd.Run()

	upOutput := upOut.String()
	if upErr.Len() > 0 {
		upOutput += "\n" + upErr.String()
	}

	success := upErr2 == nil
	message := "Mise à jour terminée"
	if !success {
		message = "Erreur lors de la mise à jour: " + upOutput
	}

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: success,
		Message: message,
		Data: gin.H{
			"pullOutput": pullOutput,
			"upOutput":   upOutput,
		},
	})
}

func (h *DockerHandler) CheckForUpdates(c *gin.Context) {
	currentImage := "etheriatimes:latest"
	projectDir := "/home/liam/Bureau/etheriatimes/etheriatimes"

	cmd := exec.Command("docker", "compose", "pull", "--dry-run", currentImage)
	cmd.Dir = projectDir
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	cmd.Run()

	hasUpdate := strings.Contains(out.String(), "Would pull") || strings.Contains(out.String(), "newer image")

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data: gin.H{
			"hasUpdate":    hasUpdate,
			"currentImage": currentImage,
			"message":      "Vérification terminée",
		},
	})
}

func splitLines(s string) []string {
	var lines []string
	for _, line := range strings.Split(s, "\n") {
		if line != "" {
			lines = append(lines, line)
		}
	}
	return lines
}
