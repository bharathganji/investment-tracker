/**
 * Get unique assets from user's trade history
 * @param trades - Array of trades to extract assets from
 * @returns Array of unique asset symbols
 */
export const getUniqueAssets = (trades: { asset: string }[]): string[] => {
  try {
    const uniqueAssets = new Set<string>();
    
    trades.forEach(trade => {
      if (trade.asset) {
        uniqueAssets.add(trade.asset);
      }
    });
    
    return Array.from(uniqueAssets).sort();
  } catch (error) {
    console.error("Error getting unique assets:", error);
    return [];
  }
};

/**
 * Filter assets based on search term
 * @param searchTerm - The term to search for
 * @param assets - Array of asset symbols to filter
 * @returns Filtered array of asset symbols
 */
export const filterAssets = (searchTerm: string, assets: string[]): string[] => {
  if (!searchTerm) return assets;
  
  const term = searchTerm.toLowerCase();
  return assets.filter(asset => 
    asset.toLowerCase().includes(term)
  );
};