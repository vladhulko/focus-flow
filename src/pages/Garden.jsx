import { useState } from 'react'
import { TreePine, ShoppingBag, Coins, Trash2, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useApp } from '../context/AppContext'
import GlassPanel from '../components/GlassPanel'

const PLANT_STORE = [
  { type: 'oak', emoji: '🌳', name: 'Oak Tree', cost: 1, description: 'Classic and sturdy' },
  { type: 'cherry', emoji: '🌸', name: 'Cherry Blossom', cost: 2, description: 'Delicate beauty' },
  { type: 'cactus', emoji: '🌵', name: 'Cactus', cost: 1, description: 'Desert survivor' },
  { type: 'sunflower', emoji: '🌻', name: 'Sunflower', cost: 2, description: 'Bright and cheerful' },
  { type: 'rose', emoji: '🌹', name: 'Rose', cost: 3, description: 'Elegant classic' },
  { type: 'tulip', emoji: '🌷', name: 'Tulip', cost: 2, description: 'Spring favorite' },
  { type: 'mushroom', emoji: '🍄', name: 'Mushroom', cost: 1, description: 'Magical fungi' },
  { type: 'bamboo', emoji: '🎋', name: 'Bamboo', cost: 2, description: 'Zen symbol' },
  { type: 'palm', emoji: '🌴', name: 'Palm Tree', cost: 3, description: 'Tropical vibes' },
  { type: 'herb', emoji: '🌿', name: 'Herb', cost: 1, description: 'Fresh greenery' },
]

const GROWTH_CONFIG = [
  { label: 'Seedling', scale: 0.45, fontSize: 'text-lg sm:text-xl', glow: false },
  { label: 'Sprout', scale: 0.7, fontSize: 'text-xl sm:text-2xl', glow: false },
  { label: 'Grown', scale: 1.0, fontSize: 'text-2xl sm:text-3xl', glow: true },
]

const getGrowthStage = (plantedAt) => {
  if (!plantedAt) return 2
  const hoursSincePlanted = (Date.now() - plantedAt) / (1000 * 60 * 60)
  if (hoursSincePlanted >= 2) return 2
  if (hoursSincePlanted >= 1) return 1
  return 0
}

const Garden = () => {
  const { flowCoins, garden, inventory, spendCoins, plantInGarden, removeFromGarden, addToInventory, removeFromInventory } = useApp()
  const [showShop, setShowShop] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null)
  const [removingIndex, setRemovingIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleBuy = (plant) => {
    if (spendCoins(plant.cost)) {
      addToInventory({ type: plant.type, emoji: plant.emoji, name: plant.name })
    }
  }

  const handlePlotClick = (index) => {
    if (garden[index] !== null) {
      setRemovingIndex(removingIndex === index ? null : index)
      return
    }

    if (selectedInventoryItem !== null) {
      const item = inventory[selectedInventoryItem]
      if (item) {
        plantInGarden(index, { type: item.type, emoji: item.emoji, name: item.name })
        removeFromInventory(item.id)
        setSelectedInventoryItem(null)
      }
    }
  }

  const handleRemovePlant = (index) => {
    removeFromGarden(index)
    setRemovingIndex(null)
  }

  const filledPlots = garden.filter(p => p !== null).length

  return (
    <div className="min-h-screen p-4 pt-8 pb-28 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Digital Garden
          </h1>
          <p className="text-white/40 text-sm">
            Your peaceful productivity sanctuary
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <GlassPanel strong className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Coins size={14} className="text-amber-400" />
                    <span className="text-amber-400 text-xs font-semibold">{flowCoins}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <TreePine size={14} className="text-green-400" />
                    <span className="text-green-400 text-xs font-semibold">{filledPlots}/25</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowShop(!showShop)}
                  className={`glass-button px-4 py-2 flex items-center gap-2 text-sm font-medium lg:hidden
                    ${showShop ? 'text-accent-pink' : 'text-white/70'}`}
                >
                  <ShoppingBag size={16} />
                  Shop
                </button>
              </div>

              {inventory.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={14} className="text-accent-purple" />
                    <span className="text-white/60 text-xs font-medium">Inventory — Click to select, then click a plot</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inventory.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedInventoryItem(selectedInventoryItem === i ? null : i)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all
                          ${selectedInventoryItem === i
                            ? 'bg-accent-pink/20 border border-accent-pink/40 scale-105'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                      >
                        <span className="text-lg">{item.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-emerald-950/30 to-amber-950/40 pointer-events-none" />

                <div className="relative p-3 sm:p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {garden.map((plant, index) => {
                      const growthStage = plant ? getGrowthStage(plant.plantedAt) : 0
                      const growth = GROWTH_CONFIG[growthStage]
                      const isSelected = removingIndex === index
                      const isHovered = hoveredIndex === index

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handlePlotClick(index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          whileTap={{ scale: 0.95 }}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center relative
                            transition-all duration-300
                            ${plant
                              ? `border ${isSelected
                                  ? 'ring-2 ring-red-400/50 bg-emerald-900/50 border-emerald-600/40'
                                  : 'bg-gradient-to-b from-emerald-900/30 to-emerald-950/50 border-emerald-700/25'
                                }
                                ${isHovered ? 'bg-emerald-800/40 border-emerald-600/40 shadow-lg shadow-emerald-500/10' : ''}`
                              : `border border-dashed
                                ${selectedInventoryItem !== null
                                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer'
                                  : 'bg-white/2 border-white/8 opacity-50'
                                }`
                            }`}
                        >
                          {plant && (
                            <>
                              <motion.span
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{
                                  scale: growth.scale,
                                  rotate: 0,
                                }}
                                transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
                                className={`${growth.fontSize} ${growth.glow ? 'garden-plant-sway drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]' : ''}`}
                              >
                                {plant.emoji}
                              </motion.span>

                              {growthStage < 2 && (
                                <div className="absolute bottom-1 left-1.5 right-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-emerald-400/60 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((growthStage + 1) / 3) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>
                              )}

                              <AnimatePresence>
                                {isHovered && !isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 rounded text-[9px] text-white/80 whitespace-nowrap z-20 pointer-events-none"
                                  >
                                    {plant.name} · {GROWTH_CONFIG[growthStage].label}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}

                          {!plant && selectedInventoryItem !== null && isHovered && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.5 }}
                              className="text-xl"
                            >
                              🌱
                            </motion.span>
                          )}

                          {isSelected && plant && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemovePlant(index)
                              }}
                              className="absolute -top-2 -right-2 bg-red-500/80 rounded-full p-1
                                       hover:bg-red-500 transition-colors z-10"
                            >
                              <Trash2 size={12} className="text-white" />
                            </motion.button>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <p className="text-white/25 text-xs text-center mt-4">
                {selectedInventoryItem !== null
                  ? '🌱 Click an empty plot to plant'
                  : inventory.length > 0
                    ? '📦 Select a plant from your inventory'
                    : '🛒 Buy plants from the shop to get started'
                }
              </p>
            </GlassPanel>
          </div>

          <AnimatePresence>
            {(showShop || typeof window !== 'undefined') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-full lg:w-80 shrink-0 ${showShop ? 'block' : 'hidden lg:block'}`}
              >
                <GlassPanel strong className="p-4 sticky top-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag size={18} className="text-accent-pink" />
                    <h2 className="text-white font-display font-semibold">Plant Shop</h2>
                  </div>

                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {PLANT_STORE.map((plant) => {
                      const canAfford = flowCoins >= plant.cost

                      return (
                        <motion.button
                          key={plant.type}
                          onClick={() => handleBuy(plant)}
                          disabled={!canAfford}
                          whileHover={canAfford ? { scale: 1.02 } : {}}
                          whileTap={canAfford ? { scale: 0.98 } : {}}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                            ${canAfford
                              ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                              : 'bg-white/2 border border-white/5 opacity-40 cursor-not-allowed'
                            }`}
                        >
                          <span className="text-2xl w-10 text-center">{plant.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{plant.name}</p>
                            <p className="text-white/40 text-xs truncate">{plant.description}</p>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 shrink-0">
                            <Coins size={12} className="text-amber-400" />
                            <span className="text-amber-400 text-xs font-semibold">{plant.cost}</span>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Garden
