"""
bazi_engine/utils.py

Core constants and mappings following Joey Yap conventions.
This is the foundation for all BaZi calculations.
"""

from typing import List, Dict

# =============================================================================
# HEAVENLY STEMS (天干) - 10 Stems
# =============================================================================
HEAVENLY_STEMS: List[str] = [
    "Jia",   # 甲 - Yang Wood
    "Yi",    # 乙 - Yin Wood
    "Bing",  # 丙 - Yang Fire
    "Ding",  # 丁 - Yin Fire
    "Wu",    # 戊 - Yang Earth
    "Ji",    # 己 - Yin Earth
    "Geng",  # 庚 - Yang Metal
    "Xin",   # 辛 - Yin Metal
    "Ren",   # 壬 - Yang Water
    "Gui"    # 癸 - Yin Water
]

# Chinese characters for stems
HEAVENLY_STEMS_CN: List[str] = [
    "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"
]

# =============================================================================
# EARTHLY BRANCHES (地支) - 12 Branches
# =============================================================================
EARTHLY_BRANCHES: List[str] = [
    "Zi",    # 子 - Rat
    "Chou",  # 丑 - Ox
    "Yin",   # 寅 - Tiger
    "Mao",   # 卯 - Rabbit
    "Chen",  # 辰 - Dragon
    "Si",    # 巳 - Snake
    "Wu",    # 午 - Horse
    "Wei",   # 未 - Goat
    "Shen",  # 申 - Monkey
    "You",   # 酉 - Rooster
    "Xu",    # 戌 - Dog
    "Hai"    # 亥 - Pig
]

# Chinese characters for branches
EARTHLY_BRANCHES_CN: List[str] = [
    "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
]

# Chinese zodiac animals
ZODIAC_ANIMALS: List[str] = [
    "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
    "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
]

# =============================================================================
# FIVE ELEMENTS (五行)
# =============================================================================
ELEMENTS: List[str] = ["Wood", "Fire", "Earth", "Metal", "Water"]
ELEMENTS_CN: List[str] = ["木", "火", "土", "金", "水"]

# Stem to Element mapping
ELEMENT_MAP: Dict[str, str] = {
    "Jia": "Wood",  "Yi": "Wood",
    "Bing": "Fire", "Ding": "Fire",
    "Wu": "Earth",  "Ji": "Earth",
    "Geng": "Metal", "Xin": "Metal",
    "Ren": "Water", "Gui": "Water"
}

# Branch to Element mapping (primary element)
BRANCH_ELEMENT_MAP: Dict[str, str] = {
    "Zi": "Water",
    "Chou": "Earth",
    "Yin": "Wood",
    "Mao": "Wood",
    "Chen": "Earth",
    "Si": "Fire",
    "Wu": "Fire",
    "Wei": "Earth",
    "Shen": "Metal",
    "You": "Metal",
    "Xu": "Earth",
    "Hai": "Water"
}

# =============================================================================
# HIDDEN STEMS (藏干) - Stems hidden within each branch
# =============================================================================
# Joey Yap canonical mapping with Main/Medium/Residual strength
BRANCH_HIDDEN_STEMS: Dict[str, List[str]] = {
    "Zi":   ["Gui"],                    # 子: 癸 (Main)
    "Chou": ["Ji", "Gui", "Xin"],       # 丑: 己 (Main), 癸 (Medium), 辛 (Residual)
    "Yin":  ["Jia", "Bing", "Wu"],      # 寅: 甲 (Main), 丙 (Medium), 戊 (Residual)
    "Mao":  ["Yi"],                     # 卯: 乙 (Main)
    "Chen": ["Wu", "Yi", "Gui"],        # 辰: 戊 (Main), 乙 (Medium), 癸 (Residual)
    "Si":   ["Bing", "Wu", "Geng"],     # 巳: 丙 (Main), 戊 (Medium), 庚 (Residual)
    "Wu":   ["Ding", "Ji"],             # 午: 丁 (Main), 己 (Medium)
    "Wei":  ["Ji", "Ding", "Yi"],       # 未: 己 (Main), 丁 (Medium), 乙 (Residual)
    "Shen": ["Geng", "Ren", "Wu"],      # 申: 庚 (Main), 壬 (Medium), 戊 (Residual)
    "You":  ["Xin"],                    # 酉: 辛 (Main)
    "Xu":   ["Wu", "Xin", "Ding"],      # 戌: 戊 (Main), 辛 (Medium), 丁 (Residual)
    "Hai":  ["Ren", "Jia"]              # 亥: 壬 (Main), 甲 (Medium)
}

# Hidden stem strength weights (Main/Medium/Residual)
HIDDEN_STEM_WEIGHTS: Dict[str, List[float]] = {
    "Zi":   [1.0],
    "Chou": [0.6, 0.3, 0.1],
    "Yin":  [0.6, 0.3, 0.1],
    "Mao":  [1.0],
    "Chen": [0.6, 0.3, 0.1],
    "Si":   [0.6, 0.3, 0.1],
    "Wu":   [0.7, 0.3],
    "Wei":  [0.6, 0.3, 0.1],
    "Shen": [0.6, 0.3, 0.1],
    "You":  [1.0],
    "Xu":   [0.6, 0.3, 0.1],
    "Hai":  [0.7, 0.3]
}

# =============================================================================
# TWELVE GROWTH PHASES (十二長生)
# =============================================================================
GROWTH_PHASES: List[str] = [
    "ChangSheng",  # 长生 - Birth/Growth
    "MuYu",        # 沐浴 - Bathing
    "GuanDai",     # 冠带 - Crown and Belt
    "LinGuan",     # 临官 - Career/Official
    "DiWang",      # 帝旺 - Emperor/Peak
    "Shuai",       # 衰 - Decline
    "Bing",        # 病 - Illness
    "Si",          # 死 - Death
    "Mu",          # 墓 - Tomb
    "Jue",         # 绝 - Extinction
    "Tai",         # 胎 - Embryo
    "Yang"         # 养 - Nurturing
]

GROWTH_PHASES_CN: List[str] = [
    "长生", "沐浴", "冠带", "临官", "帝旺", "衰",
    "病", "死", "墓", "绝", "胎", "养"
]

# =============================================================================
# ELEMENT CYCLES (五行相生相克)
# =============================================================================

# 生 (Sheng) - Generating/Producing cycle
# Wood -> Fire -> Earth -> Metal -> Water -> Wood
PRODUCES: Dict[str, str] = {
    "Wood": "Fire",
    "Fire": "Earth",
    "Earth": "Metal",
    "Metal": "Water",
    "Water": "Wood"
}

# 克 (Ke) - Controlling/Overcoming cycle
# Wood -> Earth -> Water -> Fire -> Metal -> Wood
CONTROLS: Dict[str, str] = {
    "Wood": "Earth",
    "Earth": "Water",
    "Water": "Fire",
    "Fire": "Metal",
    "Metal": "Wood"
}

# =============================================================================
# POLARITY (阴阳)
# =============================================================================

def stem_polarity(stem: str) -> str:
    """Return polarity (Yang/Yin) for a stem."""
    idx = HEAVENLY_STEMS.index(stem) if stem in HEAVENLY_STEMS else 0
    return "Yang" if idx % 2 == 0 else "Yin"

def stem_parity(stem: str) -> int:
    """Return parity: 0 = Yang, 1 = Yin."""
    return HEAVENLY_STEMS.index(stem) % 2 if stem in HEAVENLY_STEMS else 0

# =============================================================================
# SOLAR TERMS (二十四节气) - For month pillar accuracy
# =============================================================================
SOLAR_TERMS: List[str] = [
    "Lichun",    # 立春 - Start of Spring (Feb ~4)
    "Yushui",    # 雨水 - Rain Water
    "Jingzhe",   # 惊蛰 - Awakening of Insects
    "Chunfen",   # 春分 - Spring Equinox
    "Qingming",  # 清明 - Clear and Bright
    "Guyu",      # 谷雨 - Grain Rain
    "Lixia",     # 立夏 - Start of Summer (May ~6)
    "Xiaoman",   # 小满 - Grain Full
    "Mangzhong", # 芒种 - Grain in Ear
    "Xiazhi",    # 夏至 - Summer Solstice
    "Xiaoshu",   # 小暑 - Slight Heat
    "Dashu",     # 大暑 - Great Heat
    "Liqiu",     # 立秋 - Start of Autumn (Aug ~7)
    "Chushu",    # 处暑 - End of Heat
    "Bailu",     # 白露 - White Dew
    "Qiufen",    # 秋分 - Autumn Equinox
    "Hanlu",     # 寒露 - Cold Dew
    "Shuangjiang", # 霜降 - Frost Descent
    "Lidong",    # 立冬 - Start of Winter (Nov ~7)
    "Xiaoxue",   # 小雪 - Slight Snow
    "Daxue",     # 大雪 - Great Snow
    "Dongzhi",   # 冬至 - Winter Solstice
    "Xiaohan",   # 小寒 - Slight Cold
    "Dahan"      # 大寒 - Great Cold
]

SOLAR_TERMS_CN: List[str] = [
    "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
    "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
    "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
    "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"
]

# Month-starting solar terms (Jie 节) - odd indices in SOLAR_TERMS
# These define month boundaries in Joey Yap's system
MONTH_STARTING_TERMS: List[str] = [
    "Lichun",    # Month 1 (Tiger - 寅)
    "Jingzhe",   # Month 2 (Rabbit - 卯)
    "Qingming",  # Month 3 (Dragon - 辰)
    "Lixia",     # Month 4 (Snake - 巳)
    "Mangzhong", # Month 5 (Horse - 午)
    "Xiaoshu",   # Month 6 (Goat - 未)
    "Liqiu",     # Month 7 (Monkey - 申)
    "Bailu",     # Month 8 (Rooster - 酉)
    "Hanlu",     # Month 9 (Dog - 戌)
    "Lidong",    # Month 10 (Pig - 亥)
    "Daxue",     # Month 11 (Rat - 子)
    "Xiaohan"    # Month 12 (Ox - 丑)
]
