import { useWindowDimensions } from 'react-native'
import React from 'react'
import Header from '@app/components/Header'
import { Box, Button, Flex, HStack, Image, ScrollView, Text, VStack } from 'native-base'
import colors from '@app/theme/colors'
import { ICONS } from '@app/assets/svgs'
import IngredientSection from '@app/components/Ingredients'
import ingredientsJson from '@app/utils/ingredients.json'
import Recommended from '@app/components/Recommended'
import { useRoute } from '@react-navigation/native'

const Result = () => {
  const route = useRoute();
  const { capturedImage } = route.params

  const { height } = useWindowDimensions();

  const { Ingredients } = ingredientsJson
  const { Negative, Positive } = Ingredients
  return (
    <Flex flex={1} safeArea>
      <Header />
      <ScrollView flex={1} px={'5'} pt={'4'}>
        {/* <Box height={height / 4} bgColor={colors.subText} /> */}
        <Image
      alt="food"
      source={{uri: `${capturedImage}`}}
      height={height / 4}
      resizeMode='contain'
      />
        <VStack flex={1} mt={'5'} mb={'16'}>

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
      <Recommended/>
    </Flex>
  )
}

export default Result