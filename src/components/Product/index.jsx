import React from 'react'
import { Box, Button, HStack, Image, Text, VStack } from 'native-base'
import { IMAGES } from '@app/assets/images'
import { ICONS } from '@app/assets/svgs'
import colors from '@app/theme/colors'
import { useWindowDimensions } from 'react-native'

const Product = () => {

    const { width, height } = useWindowDimensions()
  return (
    <Box
    height={height / 4}
    width={width / 2.5}
    borderRadius={10}
    borderWidth={1}
    borderColor={colors.border}
    // pt={0}
    my={2}
    mx={5}
  >
    <Image
      position="relative"
      alt="scan"
      width={'1/2'}
      height={'1/2'}
      source={IMAGES.chips}
      resizeMode='contain'
      alignSelf="center"
    />
    <VStack >
        <VStack alignItems="center" mt={-2} mb={1} space={'0.5'}>
        <Text fontFamily="mono" fontWeight="400" fontSize={14} color={colors.text}>
          Chips
        </Text>
        <Text fontFamily="mono" fontWeight="400" fontSize={14} color={colors.text}>
          Product Name
        </Text>
        </VStack>
        <HStack justifyContent="space-between" pr={3} mx={4}>
          <Text fontFamily="mono" fontWeight="600" fontSize={16} color={colors.green}>
            Good
          </Text>
          <ICONS.ContentCircle/>
        </HStack>
        <HStack justifyContent="space-between" mt={'0.5'} mx={4}>
          <Text fontFamily="mono" fontWeight="400" fontSize={14} color={colors.text}>
          £20.00
          </Text>
          <Button size={'xs'} py={0}>
            <Text fontFamily="mono" fontWeight="400" fontSize={14} color={colors.white}>
            Buy
            </Text>
          </Button>
        </HStack>
    </VStack>
  </Box>
  )
}

export default Product