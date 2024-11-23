import { useWindowDimensions } from 'react-native'
import React from 'react'
import Header from '@app/components/Header'
import { Box, Flex, HStack, Image, ScrollView, Text, VStack } from 'native-base'
import colors from '@app/theme/colors'
import { ICONS } from '@app/assets/svgs'
import IngredientSection from '@app/components/Ingredients'
import ingredientsJson from '@app/utils/ingredients.json'

const Result = () => {

  const { height } = useWindowDimensions();

  const { Ingredients } = ingredientsJson
  const { Negative, Positive } = Ingredients
  return (
    <Flex flex={1} safeArea>
      <Header />
      <ScrollView flex={1} px={'5'}>
        <Box height={height / 4} bgColor={colors.subText} />
        {/* <Image
      alt="food"
      source={''}
      height={1/2}
      resizeMode='contain'
      /> */}
        <VStack flex={1} mt={'5'}>

          <HStack justifyContent="space-between">
            <HStack my="auto" alignItems="center" space={'5'}>
              <Text fontFamily="heading" fontWeight="600" fontSize="24" color={colors.red} >
                Avoid
              </Text>
              <VStack>
                <ICONS.Avoid />
              </VStack>
            </HStack>
            <VStack>
              <ICONS.ProgressCircle />
            </VStack>
          </HStack>

          <HStack alignItems="center" my={'5'}>
            <Text fontFamily="mono" fontWeight="400" fontSize="20" color={colors.text}>
              Ingredients Banned in
            </Text>
            <VStack>
              <ICONS.ArrowDown />
            </VStack>
          </HStack>
          <Text fontFamily="mono" fontWeight="400" fontSize="20" color={colors.text} pb={'3'}>
            Ingredients:
          </Text>
          <IngredientSection valueBasedIngredients={Negative} positiveIngreditents={false} />
          <IngredientSection valueBasedIngredients={Positive} positiveIngreditents={true} />
        </VStack>
      </ScrollView>
    </Flex>
  )
}

export default Result