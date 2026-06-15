package middleware

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func CORS(origins []string) gin.HandlerFunc {
	allowed := make(map[string]bool, len(origins))
	allowAll := false
	for _, origin := range origins {
		origin = strings.TrimSpace(origin)
		if origin == "" {
			continue
		}
		if origin == "*" {
			allowAll = true
		}
		allowed[origin] = true
	}

	return func(ctx *gin.Context) {
		origin := ctx.GetHeader("Origin")
		if allowAll {
			ctx.Header("Access-Control-Allow-Origin", origin)
		} else if allowed[origin] {
			ctx.Header("Access-Control-Allow-Origin", origin)
		}

		ctx.Header("Vary", "Origin")
		ctx.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		ctx.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With, X-System-Key, X-API-Key")
		ctx.Header("Access-Control-Expose-Headers", "Content-Length, Content-Type, X-Request-ID")
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.Header("Access-Control-Max-Age", strconv.Itoa(int((12 * time.Hour).Seconds())))

		if ctx.Request.Method == http.MethodOptions {
			ctx.AbortWithStatus(http.StatusNoContent)
			return
		}

		ctx.Next()
	}
}

func AdaptiveCORSMiddleware() gin.HandlerFunc {
	origins := []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	}
	if value := os.Getenv("CORS_ALLOWED_ORIGINS"); value != "" {
		origins = strings.Split(value, ",")
	}
	return CORS(origins)
}
