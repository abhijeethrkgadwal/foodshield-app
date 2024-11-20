import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { Heading, HStack } from 'native-base'
import { ICONS } from '@app/assets/svgs'
import colors from '@app/theme/colors'

const Header = () => {

    const { height } = useWindowDimensions();
  return (
    <HStack bgColor={colors.white} mt={height/24} width={"full"} padding={5} justifyContent="space-between" alignItems="center">
        <Heading fontFamily="heading" fontWeight="600" color={colors.green} fontSize={40}>
            FoodShield
        </Heading>
        <ICONS.Search
        style={{}}
        />
    </HStack>
  )
}

export default Header