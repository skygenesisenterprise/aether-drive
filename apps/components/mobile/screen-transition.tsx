import * as React from "react"

import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated"

interface ScreenTransitionProps {
  children: React.ReactNode
  direction?: "fade" | "up" | "down"
}

const springConfig = { damping: 24, stiffness: 200 }

const animations = {
  fade: FadeIn.springify(),
  up: FadeInUp.springify(),
  down: FadeInDown.springify(),
}

export function ScreenTransition({ children, direction = "fade" }: ScreenTransitionProps) {
  const entering = animations[direction].damping(springConfig.damping).stiffness(springConfig.stiffness)

  return (
    <Animated.View entering={entering} style={{ flex: 1 }}>
      {children}
    </Animated.View>
  )
}
