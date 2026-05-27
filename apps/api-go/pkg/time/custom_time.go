package pkgtime

import (
	"encoding/json"
	"time"
)

// CustomTime 自定义时间类型，JSON 输出格式为 YYYY-MM-DD HH:mm:ss
type CustomTime struct {
	time.Time
}

func (ct *CustomTime) MarshalJSON() ([]byte, error) {
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