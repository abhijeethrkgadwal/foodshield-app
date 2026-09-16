import React from 'react'
import { HStack, Progress, Text, VStack } from 'native-base'
import colors from '@app/theme/colors'

const renderHarmfulItem = (item, index) => (
    <VStack key={`${item.Ingredient}-${index}`} px={'3'} py={'2'}>
        <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1} pr={2}>
                <Text fontFamily="mono" fontSize={16} fontWeight="600" color={colors.text}>
                    {item.Ingredient}
                </Text>
                {item.MatchedTerm ? (
                    <Text fontFamily="mono" fontSize={12} fontWeight="400" color={colors.subText} mt={1}>
                        Found as: {item.MatchedTerm}
                    </Text>
                ) : null}
                {item.Reason ? (
                    <Text fontFamily="mono" fontSize={13} fontWeight="400" color={colors.text} mt={1}>
                        {item.Reason}
                    </Text>
                ) : null}
            </VStack>
            {item.Severity ? (
                <Text fontFamily="mono" fontSize={12} fontWeight="600" color={colors.red} textTransform="uppercase">
                    {item.Severity}
                </Text>
            ) : null}
        </HStack>
        {item.Percentage ? (
            <Progress value={item.Percentage} _filledTrack={{ bg: colors.red }} bg='transparent' mt={2} />
        ) : null}
    </VStack>
)

const renderPositiveItem = (item, index) => (
    <VStack key={`${item.Ingredient}-${index}`} px={'3'} py={'0.5'}>
        <HStack justifyContent="space-between">
            <HStack>
                <Text fontFamily="mono" fontSize={16} fontWeight={400} color={colors.text}>
                    {item.Ingredient}:
                </Text>
                <Text fontFamily="mono" fontSize={16} fontWeight={400} color={colors.text} ml={'2'}>
                    {item.Percentage}%
                </Text>
            </HStack>
        </HStack>
        <Progress value={item.Percentage} _filledTrack={{ bg: colors.green }} bg='transparent' />
    </VStack>
)

const IngredientSection = ({ valueBasedIngredients, positiveIngreditents }) => {
    if (!valueBasedIngredients?.length) {
        return null;
    }

    return positiveIngreditents ? (
        <VStack pb={'10'}>
            <Text fontFamily="mono" fontWeight="400" fontSize="18" color={colors.green} pb={'3'}>
                Positive
            </Text>
            {valueBasedIngredients.map(renderPositiveItem)}
        </VStack>
    ) : (
        <VStack pb={'10'}>
            <Text fontFamily="mono" fontWeight="400" fontSize="18" color={colors.red} pb={'3'}>
                Harmful
            </Text>
            {valueBasedIngredients.map(renderHarmfulItem)}
        </VStack>
    )
}

export default IngredientSection
