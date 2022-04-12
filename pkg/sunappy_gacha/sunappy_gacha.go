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
	SSROdds int `json:"ssr_odds"`
	SROdds  int `json:"sr_odds"`
	ROdds   int `json:"r_odds"`
	NOdds   int `json:"n_odds"`
}

type Table struct {
	SSRItems []string `json:"ssr_items"`
	SRItems  []string `json:"sr_items"`
	RItems   []string `json:"r_items"`
	NItems   []string `json:"n_items"`
}

func (gacha *SunappyGacha) AssignRarity(rarity int, name string) {
	switch rarity {
	case SSR:
		gacha.Table.SSRItems = append(gacha.Table.SSRItems, name)
	case SR:
		gacha.Table.SRItems = append(gacha.Table.SRItems, name)
	case R:
		gacha.Table.RItems = append(gacha.Table.RItems, name)
	case N:
		gacha.Table.NItems = append(gacha.Table.NItems, name)
	}
}
