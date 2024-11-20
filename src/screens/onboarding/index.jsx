import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import colors from '@app/theme/colors'
import { Button, Flex, Heading, Image, StatusBar, VStack } from 'native-base'
import { IMAGES } from '@app/assets/images'
import { SCREENS } from '@app/constants'

const Onboarding = ({navigation}) => {

  const onGetStart = () => {
    navigation.navigate(SCREENS.USER_BOTTOM_TABS);
  };

  const { width } = useWindowDimensions();

  return (
    <Flex bgColor={colors.green} flex={1} safeArea>
      <StatusBar barStyle="dark-content" />
      <VStack alignItems="center" my="auto">
        <Heading fontFamily="heading" fontWeight="600" color={colors.gray} fontSize={40}>
          FoodShield
        </Heading>
        <Heading fontFamily="heading" fontWeight="400" color={colors.gray} fontSize={12} mt={-2}>
          eat smart, stay healthy
        </Heading>
      </VStack>
      <Image
        alt="onboarding"
        source={IMAGES.onBoarding}
        resizeMode='contain'
      />
      <VStack my="auto" alignItems="center">
        <Button bgColor={colors.gray} width={width / 2} onPress={onGetStart}>
          <Heading fontFamily="heading" fontWeight="400" color={colors.green} fontSize={20}>
            Get Start
          </Heading>
        </Button>
        {/* <Heading fontFamily="heading" fontWeight="400" fontSize={20} mt={2} color={colors.gray}>
          Login
        </Heading> */}
      </VStack>
    </Flex>
  )
}

export default Onboarding