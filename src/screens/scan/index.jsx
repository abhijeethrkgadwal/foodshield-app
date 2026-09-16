import colors from '@app/theme/colors';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Box, Button, Flex, HStack, Image, Spinner, Text, View, VStack } from '@app/ui';
import React, { useRef, useState } from 'react';
import Header from '@app/components/Header';
import { IMAGES } from '@app/assets/images';
import { ICONS } from '@app/assets/svgs';
import Loader from '@app/components/Loader';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const camera = useRef()

  const takePicture = async () => {
    const photo = await camera.current.takePictureAsync({
      quality: 0.8,
    })
    setCapturedImage(photo.uri)
    setLoading(true)
  }

  if (!permission) {
    return (
      <VStack flex={1} justifyContent="center">
        <Spinner color={colors.green} size="md" />
      </VStack>
    )
  }

  if (!permission.granted) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={20} fontFamily="mono" fontWeight="400" textAlign="center">
          Allow your camera to
        </Text>
        <HStack>
          <ICONS.Scan color={colors.green} />
          <Text pb={5} fontSize={20} fontFamily="mono" fontWeight="400" textAlign="center"> your
            <Text fontWeight="600"> Food</Text></Text>
        </HStack>
        <Button width={'1/2'} onPress={requestPermission}>
          <Text fontFamily="mono" fontWeight="400" color={colors.white} fontSize={20}>
            Grant Permission
          </Text>
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return <Loader capturedImage={capturedImage} />
  }

  return (
    <Flex flex={1} justifyContent="center">
      <Header />
      <CameraView flex={1} ref={camera} alignItems="center">
        <Image
          alt=""
          source={IMAGES.scanner}
          my="auto"
        />
        <Box
          height={'16'}
          width={'16'}
          bgColor={colors.green}
          borderRadius={50}
          alignItems="center"
          justifyContent="center"
          margin={5}
        >
          <Button
            onPress={takePicture}
            variant={"outline"}
            colorScheme={"primary"}
            width={'12'}
            height={'12'}
            borderRadius={50}
            margin={5}
          />
        </Box>
      </CameraView>
    </Flex>
  );
};
