import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Spinner, Text, VStack } from 'native-base'
import Header from '../Header'
import colors from '@app/theme/colors'
import { useNavigation } from '@react-navigation/native'
import { SCREENS } from '@app/constants'
import { Pressable } from 'react-native'
import factsListJson from "@app/utils/loaders.json"

const Loader = ({ result, capturedImage }) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0)

  const { FactsList } = factsListJson

  const onResult = () => {
    console.log(capturedImage)
    navigation.navigate(SCREENS.RESULT, { capturedImage: capturedImage })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(index + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

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
          Please wait while we process...
        </Text>
      </VStack>
      {/* {!result && 
        <Button width={"1/2"} mx={"auto"} my="auto" onPress={onResult}>
          Get Results
        </Button>
        } */}

    </Flex>

  )
}

export default Loader