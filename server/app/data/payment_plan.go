package data

import (
	"database/sql/driver"
	"github.com/shopspring/decimal"
	"time"
)

type PaymentPlanName string

const (
	PaymentPlanNameBasic   PaymentPlanName = "Basic"
	PaymentPlanNamePro     PaymentPlanName = "Pro"
	PaymentPlanNamePremium PaymentPlanName = "Premium"
)

func (st *PaymentPlanName) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		*st = PaymentPlanName(b)
	}
	return nil
}

func (st *PaymentPlanName) Value() (driver.Value, error) {
	return string(*st), nil
}

type PaymentPlan struct {
	ID           string          `gorm:"type:uuid;default:uuid_generate_v4()" json:"id"`
	Name         PaymentPlanName `gorm:"type:payment_plan_name;not null"`
	MonthlyPrice decimal.Decimal `gorm:"type:decimal(20,8);not null"`
	DailyQueries int             `gorm:"not null"`
	CreatedAt    time.Time       `gorm:"not null;default:now()"`
	StartsAt     time.Time       `gorm:"not null;default:now()"`
	EndsAt       *time.Time
	UserID       string `gorm:"not null"`
	User         *User
}

func (s *ds) CreatePaymentPlan(plan *PaymentPlan) error {
	if tx := s.db.Create(plan); tx.Error != nil {
		return tx.Error
	}
	return nil
}

type PaymentPlanTemplate struct {
	Name          PaymentPlanName
	Price         string
	QueriesPerDay int
}

func GetPaymentPlanTemplates() []*PaymentPlanTemplate {
	return []*PaymentPlanTemplate{
		{
			Name:          PaymentPlanNameBasic,
			Price:         "5",
			QueriesPerDay: 100,
		},
		{
			Name:          PaymentPlanNamePro,
			Price:         "15",
			QueriesPerDay: 500,
		},
		{
			Name:          PaymentPlanNamePremium,
			Price:         "30",
			QueriesPerDay: 2500,
		},
	}
}
