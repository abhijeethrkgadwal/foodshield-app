import colors from '@app/theme/colors';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Box, Button, Flex, HStack, Image, Spinner, Text, View, VStack } from 'native-base';
import React, { useRef, useState } from 'react';
import Header from '@app/components/Header';
import { IMAGES } from '@app/assets/images';
import { getImageApi, UploadImageApi } from '@app/network/api';
import { ICONS } from '@app/assets/svgs';
import Loader from '@app/components/Loader';
import { SCREENS } from '@app/constants';

export default function Scan({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [imageName, setImageName] = useState("")
  const [get, setGet] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const camera = useRef()

  const takePicture = async () => {
    const photo = await camera.current.takePictureAsync({
      base64: true
    })
    setImageName(photo.uri.split('/').reverse()[0])
    setLoading(true)
    // uploadImage(photo)
    setCapturedImage(photo.uri)
    setTimeout(() => {
      setLoading(false)
      navigation.navigate(SCREENS.RESULT, {capturedImage: photo.uri})
    }, 10000);

  }

  const getImage = async () => {
    const res = await getImageApi(imageName)
    // setCapturedImage(res)
    setGet(true)
  }

    // Temporary for showcase
    const ImagePreview = () => {
    return (get ? (
      <View flex={1}>
        <Image
          alt=""
          source={{ uri: `data:image/png;base64,${capturedImage}` }}
          flex={1}
          resizeMode='contain'
        />
      </View>) :
      (
        <Button onPress={getImage}>
          getImage
        </Button>
      )
    )
  }

  const uploadImage = async (photo) => {
    const file = {
      uri: photo.uri,
      name: photo.uri.split('/').reverse()[0],
      type: 'image/jpg',
    };
    console.log(file)
    const formData = new FormData();
    formData.append('image', file)
    console.log("formdata", formData)
    await UploadImageApi(formData)
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

  if(isLoading){
    return <Loader capturedImage={capturedImage}/>
  }

  return (
      // previewVisible && capturedImage ? (
      //   <ImagePreview />
      // ) :
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

