const calculatePrice = (category, withdrawalDate) => {
  const diff = Math.abs(new Date() - withdrawalDate);
  const minutes = Math.floor((diff / 1000) / 60);
  const cost = category.costPerMinute;
  return minutes * Number(cost);
};

module.exports = calculatePrice;
