package data

import (
	"github.com/shopspring/decimal"
	"time"
)

type PaymentPlan struct {
	ID           string          `gorm:"type:uuid;default:uuid_generate_v4()" json:"id"`
	MonthlyPrice decimal.Decimal `gorm:"type:decimal(20,8);not null"`
	DailyQueries int             `gorm:"not null"`
	CreatedAt    time.Time       `gorm:"not null;default:now()"`
	Active       bool            `gorm:"not null"`
}

func (s *ds) CreatePaymentPlan(plan *PaymentPlan) error {
	if tx := s.db.Create(plan); tx.Error != nil {
		return tx.Error
	}
	return nil
}

func (s *ds) GetActivePlans() ([]*PaymentPlan, error) {
	var plans []*PaymentPlan
	tx := s.db.
		Where("active = true").
		Find(plans)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return plans, nil
}
