# Components Directory

This directory contains reusable React components for the Singapore Science Centre Kiosk app.

## Structure

- Place all reusable components in this directory
- Use TypeScript for all components
- Follow the naming convention: PascalCase for component files
- Include proper TypeScript interfaces for props

## Example Component Structure

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  title: string;
  onPress?: () => void;
}

export default function Component({ title, onPress }: ComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // styles here
  },
  title: {
    // styles here
  },
});
```