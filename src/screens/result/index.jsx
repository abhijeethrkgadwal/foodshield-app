import { useWindowDimensions } from 'react-native'
import React from 'react'
import Header from '@app/components/Header'
import { Flex, HStack, Image, ScrollView, Text, VStack } from '@app/ui'
import colors from '@app/theme/colors'
import { ICONS } from '@app/assets/svgs'
import IngredientSection from '@app/components/Ingredients'
import Recommended from '@app/components/Recommended'
import { useRoute } from '@react-navigation/native'

const Result = () => {
  const route = useRoute();
  const { capturedImage, analysis } = route.params ?? {}
  const harmfulIngredients = analysis?.harmful ?? []
  const isClean = analysis?.isClean ?? true
  const noTextFound = analysis?.noTextFound ?? false
  const scanError = analysis?.error
  const matchMode = analysis?.matchMode

  const { height } = useWindowDimensions();

  return (
    <Flex flex={1} safeArea>
      <Header />
      <ScrollView flex={1} px={'5'} pt={'4'}>
        <Image
          alt="food"
          source={{ uri: capturedImage }}
          height={height / 4}
          resizeMode='contain'
        />
        <VStack flex={1} mt={'5'} mb={'16'}>
          <HStack justifyContent="space-between">
            <HStack my="auto" alignItems="center" space={'5'}>
              <Text
                fontFamily="heading"
                fontWeight="600"
                fontSize="24"
                color={isClean ? colors.green : colors.red}
              >
                {isClean ? "Looks Good" : "Avoid"}
              </Text>
              <VStack>
                {isClean ? <ICONS.Checkmark color={colors.green} /> : <ICONS.Avoid />}
              </VStack>
            </HStack>
            <VStack>
              <ICONS.ProgressCircle />
            </VStack>
          </HStack>

          {matchMode ? (
            <Text fontFamily="mono" fontWeight="400" fontSize={12} color={colors.subText} mt={'2'}>
              Match mode: {matchMode === "minilm+fuzzy" ? "MiniLM + fuzzy OCR" : "Fuzzy OCR"}
            </Text>
          ) : null}
          {scanError ? (
            <Text fontFamily="mono" fontWeight="400" fontSize={16} color={colors.red} mt={'5'}>
              {scanError}
            </Text>
          ) : null}

          {noTextFound && !scanError ? (
            <Text fontFamily="mono" fontWeight="400" fontSize={16} color={colors.subText} mt={'5'}>
              No readable text was found on this label. Try again with better lighting and hold the camera closer to the ingredients list.
            </Text>
          ) : null}

          {isClean && !noTextFound && !scanError ? (
            <Text fontFamily="mono" fontWeight="400" fontSize={16} color={colors.green} mt={'5'}>
              No harmful ingredients from our watchlist were detected in the scanned label.
            </Text>
          ) : null}

          {!isClean ? (
            <>
              <HStack alignItems="center" my={'5'}>
                <Text fontFamily="mono" fontWeight="400" fontSize="20" color={colors.text}>
                  Harmful ingredients detected
                </Text>
                <VStack>
                  <ICONS.ArrowDown />
                </VStack>
              </HStack>
              <Text fontFamily="mono" fontWeight="400" fontSize={20} color={colors.text} pb={'3'}>
                Matched from label:
              </Text>
              <IngredientSection valueBasedIngredients={harmfulIngredients} positiveIngreditents={false} />
            </>
          ) : null}

          {analysis?.extractedText ? (
            <VStack mt={'4'} pb={'6'}>
              <Text fontFamily="mono" fontWeight="600" fontSize={16} color={colors.text} pb={'2'}>
                Extracted label text
              </Text>
              <Text fontFamily="mono" fontWeight="400" fontSize={13} color={colors.subText}>
                {analysis.extractedText}
              </Text>
            </VStack>
          ) : null}
        </VStack>
      </ScrollView>
      <Recommended />
    </Flex>
  )
}

export default Result
