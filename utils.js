import { useRef, useEffect } from 'react';

export function getSectionListData(data) {
  //console.log('MenuItems Data:', data);

  const categorizedData = data.map((item) => ({
    category: item.category,
    data: {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image
    },
  }));

  const groupedData = categorizedData.reduce((acc, currItem) => {
    const { category } = currItem;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(currItem.data);
    return acc;
  }, {});

  const sectionListData = Object.entries(groupedData).map((item) => ({
    category: item[0],
    data: item[1],
  }));
  //console.log('Section List Data: ', sectionListData[0].data[0].image);
  return sectionListData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}