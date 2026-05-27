package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// ============ 错误码定义 ============

// 成功码
const (
	CodeSuccess = 0
)

// 系统与通用错误 (10xxx)
const (
	CodeParamFormatError       = 10001 // 请求参数格式错误
	CodeMissingParam           = 10002 // 缺少必要参数
	CodeParamTypeError         = 10003 // 参数类型不匹配
	CodeInterfaceOffline       = 10004 // 接口已下线或不存在
	CodeRateLimitExceeded      = 10005 // 请求过于频繁（触发限流）
	CodeSystemInternalError    = 10006 // 系统内部未知错误
)

// 认证与授权错误 (20xxx)
const (
	CodeNoAuthToken            = 20001 // 未提供认证 Token（请先登录）
	CodeTokenExpired           = 20002 // Token 已过期
	CodeTokenInvalid           = 20003 // Token 签名无效或损坏
	CodeTokenReplaced          = 20004 // 账号在其他地方登录（被顶下线）
	CodePermissionDenied       = 20005 // 权限不足（禁止访问该接口）
	CodeAccountFrozen          = 20006 // 账号已被冻结/禁用
)

// 用户与账户业务 (30xxx)
const (
	CodeInvalidCredentials     = 30001 // 账号或密码错误
	CodeUserAlreadyExists      = 30002 // 手机号/邮箱已被注册
	CodeUserNotFound           = 30003 // 用户不存在
	CodeVerifyCodeInvalid      = 30004 // 验证码错误或已过期
	CodeSamePassword           = 30005 // 新密码不能与旧密码相同
)

// 数据与资源错误 (40xxx)
const (
	CodeResourceNotFound       = 40001 // 请求的资源不存在
	CodeResourceStatusInvalid  = 40002 // 资源状态不允许此操作
	CodeDataConflict           = 40003 // 数据冲突/重复提交（幂等性校验失败）
	CodeDataWriteFailed        = 40004 // 数据写入/更新失败
)

// 第三方服务与文件错误 (50xxx)
const (
	CodeFileUploadFailed       = 50001 // 文件上传失败（格式不支持或超大）
	CodePaymentTimeout         = 50002 // 第三方支付接口调用超时
	CodeSMSSendFailed          = 50003 // 短信网关发送失败
	CodeRemoteServiceUnavailable = 50004 // 远程服务暂不可用（微服务熔断）
)

// ============ 响应函数 ============

// Success 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: "success",
		Data:    data,
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}

// ============ 系统与通用错误 (10xxx) ============

// ParamFormatError 请求参数格式错误
func ParamFormatError(c *gin.Context) {
	Error(c, CodeParamFormatError, "请求参数格式错误")
}

// MissingParam 缺少必要参数
func MissingParam(c *gin.Context) {
	Error(c, CodeMissingParam, "缺少必要参数")
}

// ParamTypeError 参数类型不匹配
func ParamTypeError(c *gin.Context) {
	Error(c, CodeParamTypeError, "参数类型不匹配")
}

// InterfaceOffline 接口已下线或不存在
func InterfaceOffline(c *gin.Context) {
	Error(c, CodeInterfaceOffline, "接口已下线或不存在")
}

// RateLimitExceeded 请求过于频繁
func RateLimitExceeded(c *gin.Context) {
	Error(c, CodeRateLimitExceeded, "请求过于频繁，请稍后再试")
}

// SystemInternalError 系统内部未知错误
func SystemInternalError(c *gin.Context) {
	Error(c, CodeSystemInternalError, "系统内部错误，请稍后再试")
}

// ============ 认证与授权错误 (20xxx) ============

// NoAuthToken 未提供认证 Token
func NoAuthToken(c *gin.Context) {
	Error(c, CodeNoAuthToken, "请先登录")
}

// TokenExpired Token 已过期
func TokenExpired(c *gin.Context) {
	Error(c, CodeTokenExpired, "登录已过期，请重新登录")
}

// TokenInvalid Token 签名无效或损坏
func TokenInvalid(c *gin.Context) {
	Error(c, CodeTokenInvalid, "Token 无效，请重新登录")
}

// TokenReplaced 账号在其他地方登录
func TokenReplaced(c *gin.Context) {
	Error(c, CodeTokenReplaced, "账号已在其他地方登录，请重新登录")
}

// PermissionDenied 权限不足
func PermissionDenied(c *gin.Context) {
	Error(c, CodePermissionDenied, "权限不足，禁止访问")
}

// AccountFrozen 账号已被冻结/禁用
func AccountFrozen(c *gin.Context) {
	Error(c, CodeAccountFrozen, "账号已被冻结，请联系客服")
}

// ============ 用户与账户业务 (30xxx) ============

// InvalidCredentials 账号或密码错误
func InvalidCredentials(c *gin.Context) {
	Error(c, CodeInvalidCredentials, "账号或密码错误")
}

// UserAlreadyExists 手机号/邮箱已被注册
func UserAlreadyExists(c *gin.Context) {
	Error(c, CodeUserAlreadyExists, "该账号已被注册")
}

// UserNotFound 用户不存在
func UserNotFound(c *gin.Context) {
	Error(c, CodeUserNotFound, "用户不存在")
}

// VerifyCodeInvalid 验证码错误或已过期
func VerifyCodeInvalid(c *gin.Context) {
	Error(c, CodeVerifyCodeInvalid, "验证码错误或已过期")
}

// SamePassword 新密码不能与旧密码相同
func SamePassword(c *gin.Context) {
	Error(c, CodeSamePassword, "新密码不能与旧密码相同")
}

// ============ 数据与资源错误 (40xxx) ============

// ResourceNotFound 请求的资源不存在
func ResourceNotFound(c *gin.Context) {
	Error(c, CodeResourceNotFound, "资源不存在")
}

// ResourceStatusInvalid 资源状态不允许此操作
func ResourceStatusInvalid(c *gin.Context) {
	Error(c, CodeResourceStatusInvalid, "当前状态不允许此操作")
}

// DataConflict 数据冲突/重复提交
func DataConflict(c *gin.Context) {
	Error(c, CodeDataConflict, "数据冲突，请勿重复提交")
}

// DataWriteFailed 数据写入/更新失败
func DataWriteFailed(c *gin.Context) {
	Error(c, CodeDataWriteFailed, "数据操作失败")
}

// ============ 第三方服务与文件错误 (50xxx) ============

// FileUploadFailed 文件上传失败
func FileUploadFailed(c *gin.Context) {
	Error(c, CodeFileUploadFailed, "文件上传失败，请检查格式和大小")
}

// PaymentTimeout 第三方支付接口调用超时
func PaymentTimeout(c *gin.Context) {
	Error(c, CodePaymentTimeout, "支付接口响应超时，请稍后查询")
}

// SMSSendFailed 短信网关发送失败
func SMSSendFailed(c *gin.Context) {
	Error(c, CodeSMSSendFailed, "短信发送失败，请稍后重试")
}

// RemoteServiceUnavailable 远程服务暂不可用
func RemoteServiceUnavailable(c *gin.Context) {
	Error(c, CodeRemoteServiceUnavailable, "服务暂时不可用，请稍后再试")
}

// ============ 兼容旧版本的通用函数 ============

// ParamError 参数错误（兼容旧版）
func ParamError(c *gin.Context) {
	ParamFormatError(c)
}

// Unauthorized 未授权（兼容旧版）
func Unauthorized(c *gin.Context) {
	NoAuthToken(c)
}

// Forbidden 禁止访问（兼容旧版）
func Forbidden(c *gin.Context) {
	PermissionDenied(c)
}

// NotFound 资源不存在（兼容旧版）
func NotFound(c *gin.Context) {
	ResourceNotFound(c)
}

// InternalServerError 服务器内部错误（兼容旧版）
func InternalServerError(c *gin.Context) {
	SystemInternalError(c)
}
