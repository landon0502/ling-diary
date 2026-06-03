package pkgtime

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// CustomTime 自定义时间类型，JSON 输出格式为 YYYY-MM-DD HH:mm:ss
type CustomTime struct {
	time.Time
}

// Value 实现 driver.Valuer 接口，GORM 写入数据库时调用
func (ct CustomTime) Value() (driver.Value, error) {
	return ct.Time, nil
}

// Scan 实现 sql.Scanner 接口，GORM 从数据库读取时调用
func (ct *CustomTime) Scan(value interface{}) error {
	if value == nil {
		ct.Time = time.Time{}
		return nil
	}
	t, ok := value.(time.Time)
	if !ok {
		return fmt.Errorf("CustomTime.Scan: 无法将 %T 转为 time.Time", value)
	}
	ct.Time = t
	return nil
}

func (ct CustomTime) MarshalJSON() ([]byte, error) {
	if ct.IsZero() {
		return []byte(`""`), nil
	}
	return json.Marshal(ct.Format("2006-01-02 15:04:05"))
}

func (ct *CustomTime) UnmarshalJSON(data []byte) error {
	if string(data) == `""` {
		ct.Time = time.Time{}
		return nil
	}
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	t, err := time.Parse("2006-01-02 15:04:05", s)
	if err != nil {
		return err
	}
	ct.Time = t
	return nil
}