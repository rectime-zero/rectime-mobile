import React from 'react';
import {Pressable, Text} from 'react-native';

type ActionButtonTone = 'primary' | 'secondary' | 'ghost';
type ActionButtonSize = 'regular' | 'compact';

type ActionButtonProps = {
    label: string;
    onPress: () => void;
    tone?: ActionButtonTone;
    size?: ActionButtonSize;
};

const toneClasses: Record<ActionButtonTone, string> = {
    primary: 'bg-slate-950',
    secondary: 'border border-slate-200 bg-white',
    ghost: 'bg-slate-100',
};

const textClasses: Record<ActionButtonTone, string> = {
    primary: 'text-white',
    secondary: 'text-slate-900',
    ghost: 'text-slate-700',
};

const sizeClasses: Record<ActionButtonSize, string> = {
    regular: 'min-h-12 rounded-2xl px-4 py-3',
    compact: 'min-h-10 rounded-xl px-3 py-2',
};

function ActionButton({
    label,
    onPress,
    tone = 'primary',
    size = 'regular',
}: ActionButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`items-center justify-center ${toneClasses[tone]} ${sizeClasses[size]}`}>
            <Text className={`text-sm font-bold ${textClasses[tone]}`}>{label}</Text>
        </Pressable>
    );
}

export default ActionButton;
