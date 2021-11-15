const calculatePrice = (category, bookDate) => {
  const diffTime = Math.abs(new Date().getTime() - bookDate.getTime());
  const minutes = parseInt((diffTime / (1000 * 60)) % 60, 10);
  return minutes * Number(category.costPerMinute);
};

module.exports = calculatePrice;
