export type MoexUniverseItem = {
    spotSecid: string
    assetCode: string
    label: string
}

export const STOCK_FUTURES_UNIVERSE: MoexUniverseItem[] = [
    { spotSecid: 'SBER', assetCode: 'SBRF', label: 'Sberbank' },
    { spotSecid: 'GAZP', assetCode: 'GAZR', label: 'Gazprom' },
    { spotSecid: 'LKOH', assetCode: 'LKOH', label: 'Lukoil' },
    { spotSecid: 'GMKN', assetCode: 'GMKN', label: 'Norilsk Nickel' },
    { spotSecid: 'ROSN', assetCode: 'ROSN', label: 'Rosneft' },
    { spotSecid: 'NVTK', assetCode: 'NOTKM', label: 'Novatek' },
    { spotSecid: 'TATN', assetCode: 'TATN', label: 'Tatneft' },
    { spotSecid: 'MGNT', assetCode: 'MGNT', label: 'Magnit' },
]

export const CALENDAR_SPREAD_UNIVERSE: MoexUniverseItem[] = [
    { spotSecid: 'Si', assetCode: 'Si', label: 'USD/RUB' },
    { spotSecid: 'RI', assetCode: 'RTS', label: 'RTS Index' },
    { spotSecid: 'MX', assetCode: 'MXI', label: 'MOEX Index' },
    ...STOCK_FUTURES_UNIVERSE,
]
