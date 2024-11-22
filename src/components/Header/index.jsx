import { useWindowDimensions } from 'react-native'
import React from 'react'
import { Box, Heading, HStack, Pressable, Text, VStack } from 'native-base'
import { ICONS } from '@app/assets/svgs'
import colors from '@app/theme/colors'
import { useNavigation } from '@react-navigation/native'

const Header = ({ showBack = true }) => {
  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.goBack();
  };

  const { height } = useWindowDimensions();

  return (
    <VStack>
      {showBack ?
        <Pressable onPress={onPressBack}>
          <HStack h={height / 24} bgColor={colors.gray} alignItems="center" pl={1}>
            <ICONS.ArrowBack
              style={{ transform: [{ scale: 1.1 }] }}
            />
            <Text>Back</Text>
          </HStack>
        </Pressable>
        : (<Box w={3} />)}
      <HStack bgColor={colors.white} mt={showBack ? 0 : height / 24} width={"full"} padding={5} justifyContent="space-between" alignItems="center">
        <Heading fontFamily="heading" fontWeight="600" color={colors.green} fontSize={40}>
          FoodShield
        </Heading>
        <ICONS.Search
          style={{}}
        />
      </HStack>
    </VStack>
  )
}

export default Header