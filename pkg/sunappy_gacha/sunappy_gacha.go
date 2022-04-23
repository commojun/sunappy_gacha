package sunappy_gacha

const (
	SSR = iota
	SR
	R
	N
)

type SunappyGacha struct {
	EmissionRate EmissionRate `json:"emission_rate"`
	Table        Table        `json:"table"`
}

type EmissionRate struct {
	SSR int `json:"SSR"`
	SR  int `json:"SR"`
	R   int `json:"R"`
	N   int `json:"N"`
}

type Table struct {
	SSR []string `json:"SSR"`
	SR  []string `json:"SR"`
	R   []string `json:"R"`
	N   []string `json:"N"`
}

func (gacha *SunappyGacha) AssignRarity(rarity int, name string) {
	switch rarity {
	case SSR:
		gacha.Table.SSR = append(gacha.Table.SSR, name)
	case SR:
		gacha.Table.SR = append(gacha.Table.SR, name)
	case R:
		gacha.Table.R = append(gacha.Table.R, name)
	case N:
		gacha.Table.N = append(gacha.Table.N, name)
	}
}
