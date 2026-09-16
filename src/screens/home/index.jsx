import { useWindowDimensions } from 'react-native'
import React from 'react'
import { Button, Flex, Image, Text, VStack } from '@app/ui'
import colors from '@app/theme/colors'
import Header from '@app/components/Header'
import { IMAGES } from '@app/assets/images'
import { ICONS } from '@app/assets/svgs'
import { SCREENS } from '@app/constants'
import { useEmbedder } from '@app/ai/EmbedderProvider'

const Home = ({ navigation }) => {
  const { isReady, isLoading, downloadProgress, error } = useEmbedder()

  const onPressScan = () => {
    navigation.navigate(SCREENS.SCAN)
  }

  const { width, height } = useWindowDimensions();

  const modelStatus = error
    ? "Fuzzy matching ready (MiniLM unavailable)"
    : isReady
      ? "On-device MiniLM ready"
      : isLoading
        ? `Preparing MiniLM… ${downloadProgress}%`
        : "Preparing on-device AI…"

  return (
    <Flex bgColor={colors.gray} flex={0} safeArea>
      <Header showBack={false}/>
      <VStack mt={height/32} >
        <Text fontFamily="mono" fontWeight="600" fontSize={31} color={colors.green} ml={'5'}>
          Eat Smart,{"\n"}Stay Healthy : {"\n"}Scan, Analyse, and {"\n"}Choose Better
        </Text>
        <Text fontFamily="mono" fontWeight="400" fontSize={12} color={colors.subText} ml={'5'} mt={2}>
          {modelStatus}
        </Text>
        <VStack alignItems="center" mt={height/24}>
          <Image
            position="relative"
            alt="scan"
            width={width}
            height={height/3}
            source={IMAGES.scan}
            resizeMode='contain'
          />
          <VStack position="absolute" top={'1/3'} alignItems="center">
          <Button
            onPress={onPressScan}
            leftIcon={<ICONS.Scan color={colors.white}/>} size="lg" mr={5} width={width/2.5} marginY="auto">
            <Text fontFamily="mono" fontWeight="400" color={colors.white} pl={4} fontSize={20}>Scan</Text>
          </Button>
          <Text fontFamily="mono" fontWeight="400" fontSize={16} color={colors.text} paddingTop="4" paddingRight="5">
            Scan the product
          </Text>
          </VStack>
        </VStack>
      </VStack>
    </Flex>
  )
}

export default Home
