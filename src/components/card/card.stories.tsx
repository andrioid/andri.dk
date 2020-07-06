import React from 'react'
import { Card } from '.'

export default {
    title: "Card"
}

export const cardStory = () => (
    <div className="p-10">
        <Card title="Test title" description="moo cow" link="#" date="2020-01-01" />
    </div>

)