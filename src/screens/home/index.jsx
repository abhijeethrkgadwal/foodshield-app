import { useWindowDimensions, View } from 'react-native'
import React from 'react'
import { Button, Flex, HStack, Image, Text, VStack } from 'native-base'
import colors from '@app/theme/colors'
import Header from '@app/components/Header'
import { IMAGES } from '@app/assets/images'
import { ICONS } from '@app/assets/svgs'

const Home = () => {

  const { width, height } = useWindowDimensions();

  return (
    <Flex bgColor={colors.gray} flex={0} safeArea>
      <Header />
      <VStack mt={height/32} >
        <Text fontFamily="mono" fontWeight="600" fontSize={31} color={colors.green} ml={'5'}>
          Eat Smart,{"\n"}Stay Healthy : {"\n"}Scan, Analyse, and {"\n"}Choose Better
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
            leftIcon={<ICONS.Scan />} size="lg" mr={5} width={width/2.5} marginY="auto">
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