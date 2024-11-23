import React from 'react'
import { HStack, Progress, Text, VStack } from 'native-base'
import colors from '@app/theme/colors'

const renderNegativeItem = (item,index) => (
    <VStack key={index} px={'3'} py={'0.5'}>
        <HStack justifyContent="space-between">
            <HStack>
                <Text fontFamily="mono" fontSize={16} fontWeight={400} color={colors.text}>
                    {item.Ingredient}:
                </Text>
                <Text fontFamily="mono" fontSize={16} fontWeight={400} color={colors.text} ml={'2'}>
                    {item.Percentage}%
                </Text>
            </HStack>
            <Text fontFamily="mono" fontSize={14} fontWeight={400} color={colors.text}>
                Learn More
            </Text>
        </HStack>
        <Progress value={item.Percentage} _filledTrack={{ bg: colors.red }} bg='transparent' />
    </VStack>
)

const renderPositiveItem = (item,index) => (
    <VStack key={index} px={'3'} py={'0.5'}>
        <HStack justifyContent="space-between">
            <HStack>
                <Text fontFamily="mono" fontSize={16} fontWeight={400} color={colors.text}>
                    {item.Ingredient}:
                </Text>
                <Text fontFamily="mono" fontSize={16} fontWeight={400} color={colors.text} ml={'2'}>
                    {item.Percentage}%
                </Text>
            </HStack>
            <Text fontFamily="mono" fontSize={14} fontWeight={400} color={colors.text}>
                Learn More
            </Text>
        </HStack>
        <Progress value={item.Percentage} _filledTrack={{ bg: colors.green }} bg='transparent' />
    </VStack>
)

const IngredientSection = ({ valueBasedIngredients, positiveIngreditents }) => {
    return ( positiveIngreditents ? (
            <VStack pb={'10'}>
                <Text fontFamily="mono" fontWeight="400" fontSize="18" color={colors.green} pb={'3'}>
                    Positive
                </Text>
                { valueBasedIngredients.map(renderPositiveItem) }
            </VStack>

        ) : (
            <VStack pb={'10'}>
                <Text fontFamily="mono" fontWeight="400" fontSize="18" color={colors.red} pb={'3'}>
                    Negative
                </Text>
                { valueBasedIngredients.map(renderNegativeItem) }
            </VStack>
        )
    )
}

export default IngredientSection