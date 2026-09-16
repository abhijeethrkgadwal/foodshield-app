import React, { useEffect, useRef, useState } from 'react'
import { Box, Flex, Spinner, Text, VStack } from 'native-base'
import Header from '../Header'
import colors from '@app/theme/colors'
import { useNavigation } from '@react-navigation/native'
import { SCREENS } from '@app/constants'
import factsListJson from "@app/utils/loaders.json"
import { scanImageForHarmfulIngredients } from '@app/utils/ocrAnalysis'

const Loader = ({ capturedImage }) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0)
  const hasProcessed = useRef(false)

  const { FactsList } = factsListJson

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % FactsList.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [FactsList.length]);

  useEffect(() => {
    if (!capturedImage || hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    const processScan = async () => {
      try {
        const analysis = await scanImageForHarmfulIngredients(capturedImage);
        navigation.replace(SCREENS.RESULT, {
          capturedImage,
          analysis,
        });
      } catch (error) {
        navigation.replace(SCREENS.RESULT, {
          capturedImage,
          analysis: {
            harmful: [],
            isClean: true,
            extractedText: "",
            noTextFound: true,
            error: error.message ?? "Could not read text from this image.",
          },
        });
      }
    };

    processScan();
  }, [capturedImage, navigation]);

  return (
    <Flex flex={1} safeArea>
      <Header showBack={false} />
      <VStack alignItems="center" my="auto">
        <Box
          position={"relative"}
          height={6}
          width={6}
          bgColor={colors.green}
          borderRadius={50}
          opacity={0.5}
        />
        <Spinner position={"absolute"} size="xl" mt={-3} />
        <Text fontFamily="mono" fontWeight="600" color={colors.green} fontSize={20} mt={'10'}>
          Do you know?
        </Text>
        <Text fontFamily="mono" fontWeight="400" color={colors.text} fontSize={16} mx={"1/5"} textAlign="center">
          {FactsList[index]}
        </Text>
        <Text fontFamily="mono" fontWeight="400" color={colors.subText} fontSize={12} mt={'12'}>
          Reading label with on-device OCR...
        </Text>
      </VStack>
    </Flex>
  )
}

export default Loader
