package models

type APIMeta struct {
	RequestID string `json:"requestId"`
	Timestamp string `json:"timestamp"`
}

type APIError struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

type Pagination struct {
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

type APIEnvelope struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data,omitempty"`
	Pagination *Pagination `json:"pagination,omitempty"`
	Error      *APIError   `json:"error,omitempty"`
	Meta       APIMeta     `json:"meta"`
}

type SiteResource struct {
	ID        string                 `json:"id"`
	Resource  string                 `json:"resource"`
	Status    string                 `json:"status,omitempty"`
	Slug      string                 `json:"slug,omitempty"`
	Name      string                 `json:"name,omitempty"`
	Title     string                 `json:"title,omitempty"`
	Email     string                 `json:"email,omitempty"`
	Role      string                 `json:"role,omitempty"`
	Secret    string                 `json:"secret,omitempty"`
	Data      map[string]interface{} `json:"data,omitempty"`
	CreatedAt string                 `json:"createdAt"`
	UpdatedAt string                 `json:"updatedAt"`
}

type SiteResourceInput struct {
	Status string                 `json:"status"`
	Slug   string                 `json:"slug"`
	Name   string                 `json:"name"`
	Title  string                 `json:"title"`
	Email  string                 `json:"email"`
	Role   string                 `json:"role"`
	Secret string                 `json:"secret"`
	Data   map[string]interface{} `json:"data"`
}

type ListQuery struct {
	Page     int
	PageSize int
	Search   string
	Status   string
	Sort     string
	Order    string
	From     string
	To       string
}
