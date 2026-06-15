package services

import (
	"crypto/rand"
	"encoding/hex"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/skygenesisenterprise/company-website/server/src/models"
)

type SiteAPIService struct {
	mu    sync.RWMutex
	items map[string]map[string]*models.SiteResource
}

func NewSiteAPIService() *SiteAPIService {
	return &SiteAPIService{
		items: make(map[string]map[string]*models.SiteResource),
	}
}

func (s *SiteAPIService) List(resource string, query models.ListQuery) ([]*models.SiteResource, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var rows []*models.SiteResource
	for _, item := range s.items[resource] {
		if !matchesQuery(item, query) {
			continue
		}
		rows = append(rows, cloneResource(resource, item, true))
	}

	sort.SliceStable(rows, func(i, j int) bool {
		left := rows[i]
		right := rows[j]
		desc := strings.EqualFold(query.Order, "desc")

		var less bool
		switch query.Sort {
		case "name":
			less = strings.ToLower(left.Name) < strings.ToLower(right.Name)
		case "title":
			less = strings.ToLower(left.Title) < strings.ToLower(right.Title)
		case "status":
			less = strings.ToLower(left.Status) < strings.ToLower(right.Status)
		default:
			less = left.CreatedAt < right.CreatedAt
		}

		if desc {
			return !less
		}
		return less
	})

	total := len(rows)
	page, pageSize := normalizePagination(query.Page, query.PageSize)
	start := (page - 1) * pageSize
	if start >= total {
		return []*models.SiteResource{}, total
	}

	end := start + pageSize
	if end > total {
		end = total
	}
	return rows[start:end], total
}

func (s *SiteAPIService) Get(resource, id string) (*models.SiteResource, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	item, ok := s.items[resource][id]
	if !ok {
		return nil, false
	}
	return cloneResource(resource, item, true), true
}

func (s *SiteAPIService) GetBySlug(resource, slug string) (*models.SiteResource, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, item := range s.items[resource] {
		if item.Slug == slug {
			return cloneResource(resource, item, true), true
		}
	}
	return nil, false
}

func (s *SiteAPIService) Create(resource string, input models.SiteResourceInput) *models.SiteResource {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC().Format(time.RFC3339)
	item := &models.SiteResource{
		ID:        uuid.NewString(),
		Resource:  resource,
		Status:    strings.TrimSpace(input.Status),
		Slug:      strings.TrimSpace(input.Slug),
		Name:      strings.TrimSpace(input.Name),
		Title:     strings.TrimSpace(input.Title),
		Email:     strings.TrimSpace(input.Email),
		Role:      strings.TrimSpace(input.Role),
		Secret:    input.Secret,
		Data:      copyData(input.Data),
		CreatedAt: now,
		UpdatedAt: now,
	}
	if item.Status == "" {
		item.Status = defaultStatus(resource)
	}
	if resource == "api-keys" && item.Secret == "" {
		item.Secret = generateSecret()
	}

	if s.items[resource] == nil {
		s.items[resource] = make(map[string]*models.SiteResource)
	}
	s.items[resource][item.ID] = item

	return cloneResource(resource, item, resource != "api-keys")
}

func (s *SiteAPIService) Update(resource, id string, input models.SiteResourceInput) (*models.SiteResource, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item, ok := s.items[resource][id]
	if !ok {
		return nil, false
	}

	if input.Status != "" {
		item.Status = strings.TrimSpace(input.Status)
	}
	if input.Slug != "" {
		item.Slug = strings.TrimSpace(input.Slug)
	}
	if input.Name != "" {
		item.Name = strings.TrimSpace(input.Name)
	}
	if input.Title != "" {
		item.Title = strings.TrimSpace(input.Title)
	}
	if input.Email != "" {
		item.Email = strings.TrimSpace(input.Email)
	}
	if input.Role != "" {
		item.Role = strings.TrimSpace(input.Role)
	}
	if input.Secret != "" {
		item.Secret = input.Secret
	}
	if input.Data != nil {
		item.Data = copyData(input.Data)
	}
	item.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	return cloneResource(resource, item, true), true
}

func (s *SiteAPIService) Delete(resource, id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.items[resource] == nil {
		return false
	}
	if _, ok := s.items[resource][id]; !ok {
		return false
	}
	delete(s.items[resource], id)
	return true
}

func (s *SiteAPIService) SetStatus(resource, id, status string) (*models.SiteResource, bool) {
	return s.Update(resource, id, models.SiteResourceInput{Status: status})
}

func (s *SiteAPIService) RotateAPIKey(id string) (*models.SiteResource, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item, ok := s.items["api-keys"][id]
	if !ok {
		return nil, false
	}
	item.Secret = generateSecret()
	item.Status = "active"
	item.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
	return cloneResource("api-keys", item, false), true
}

func (s *SiteAPIService) SeedStatus() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.items["status"] == nil {
		s.items["status"] = make(map[string]*models.SiteResource)
	}
	if len(s.items["status"]) > 0 {
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	item := &models.SiteResource{
		ID:        "current",
		Resource:  "status",
		Status:    "operational",
		Title:     "Sky Genesis Enterprise status",
		Data:      map[string]interface{}{"incidents": []interface{}{}, "maintenance": []interface{}{}},
		CreatedAt: now,
		UpdatedAt: now,
	}
	s.items["status"][item.ID] = item
}

func normalizePagination(page, pageSize int) (int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}
	return page, pageSize
}

func matchesQuery(item *models.SiteResource, query models.ListQuery) bool {
	if query.Status != "" && !strings.EqualFold(item.Status, query.Status) {
		return false
	}

	if query.Search == "" {
		return true
	}
	search := strings.ToLower(query.Search)
	return strings.Contains(strings.ToLower(item.Name), search) ||
		strings.Contains(strings.ToLower(item.Title), search) ||
		strings.Contains(strings.ToLower(item.Slug), search) ||
		strings.Contains(strings.ToLower(item.Email), search)
}

func defaultStatus(resource string) string {
	switch resource {
	case "api-keys", "webhooks", "linker", "newsletter", "subscriptions", "users":
		return "active"
	case "pages", "comments":
		return "draft"
	default:
		return "enabled"
	}
}

func cloneResource(resource string, item *models.SiteResource, maskSecret bool) *models.SiteResource {
	clone := *item
	clone.Data = copyData(item.Data)
	if resource == "api-keys" && maskSecret {
		clone.Secret = maskSecretValue(item.Secret)
	}
	return &clone
}

func copyData(data map[string]interface{}) map[string]interface{} {
	if data == nil {
		return nil
	}
	copied := make(map[string]interface{}, len(data))
	for key, value := range data {
		copied[key] = value
	}
	return copied
}

func generateSecret() string {
	bytes := make([]byte, 24)
	if _, err := rand.Read(bytes); err != nil {
		return "sge_" + uuid.NewString()
	}
	return "sge_" + hex.EncodeToString(bytes)
}

func maskSecretValue(secret string) string {
	if secret == "" {
		return ""
	}
	if len(secret) <= 8 {
		return "********"
	}
	return secret[:4] + "..." + secret[len(secret)-4:]
}
