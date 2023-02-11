package data

func Migrate() error {
	s, err := getDS()
	if err != nil {
		return err
	}
	err = s.db.AutoMigrate(
		&User{},
	)
	if err != nil {
		return err
	}
	return nil
}
