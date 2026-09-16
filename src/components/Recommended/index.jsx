import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlashList, BottomSheetView } from '@gorhom/bottom-sheet';
import colors from '@app/theme/colors';
import { HStack, Pressable, Text, VStack } from '@app/ui';
import { ICONS } from '@app/assets/svgs';
import Product from '@app/components/Product';

const Recommended = () => {
  const [index, setIndex] = useState(0)

  const { height } = useWindowDimensions()

  const recommendRef = useRef(null);

  const data = ['1', '2', '3', '4', '5']

  const renderItem = () => <Product />

  const openRecommended = () => {
    setIndex(1)
  }

  const snapPoints = useMemo(() => ["8%", "60%"], []);

  const handleSheetChanges = useCallback((index) => {
    setIndex(index)
  }, []);

  const headerComponent = () => {
    return (
      <HStack justifyContent="space-between" alignItems="center" height={height/12.5} paddingLeft={6}>
        <Text fontFamily="mono" fontWeight="400" fontSize={20} color={colors.text}>
          Recommended
        </Text>
        <Pressable onPress={openRecommended} p={6}>
          <ICONS.ArrowUp />
        </Pressable>
      </HStack>
    )
  }
  return (
      <BottomSheet
        ref={recommendRef}
        handleComponent={headerComponent}
        onChange={handleSheetChanges}
        index={index}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text fontFamily="mono" fontWeight="400" fontSize={14} color={colors.subText} paddingX={6}>
            These alternatives are suggested based on ingredient analysis.
          </Text>
          <VStack>
            <HStack my={5} paddingX={6}>
              <Text fontFamily="mono" fontWeight="400" fontSize={18} color={colors.text} mr={1}>
                Healthier Alternatives
              </Text>
              <VStack mr={1}>
                <ICONS.Health />
              </VStack>
              <ICONS.ArrowRight />
            </HStack>
            {/* <BottomSheetFlashList
          data={data}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          estimatedItemSize={43.3}
          horizontal={true}
        /> */}
            <HStack>
              <Product />
              <Product />
            </HStack>
          </VStack>
          <VStack pb={'24'}>
            <HStack my={5} paddingX={6}>
              <Text fontFamily="mono" fontWeight="400" fontSize={18} color={colors.text} mr={1}>
                Vegan Alternatives
              </Text>
              <VStack mr={1}>
                <ICONS.Vegan />
              </VStack>
              <ICONS.ArrowRight />
            </HStack>
            {/* <BottomSheetFlashList
          data={data}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          estimatedItemSize={43.3}
          horizontal={true}
        /> */}
            <HStack>
              <Product />
              <Product />
            </HStack>
          </VStack>
        </ScrollView>
      </BottomSheet>
  );
};

export default Recommended;