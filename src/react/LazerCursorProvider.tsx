"use client"

import React, { useEffect, useRef, useState, FC, ReactNode } from "react"
import { LazerCursorEngine } from "../LazerCursorEngine"
import "../styles/cursor.css"

type Props = {
  children: ReactNode
}

export const StarcursorProvider: FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<LazerCursorEngine>()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && cursorRef.current) {
      engineRef.current = new LazerCursorEngine(cursorRef.current, { useDamping: true })
    }
    return () => {
      engineRef.current?.destroy()
    }
  }, [mounted])

  return (
    <div className="starcursor-container">
      {children}
      {mounted && <div ref={cursorRef} className="starcursor-cursor" />}
    </div>
  )
}
