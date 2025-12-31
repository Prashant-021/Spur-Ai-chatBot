import React, { useEffect, useRef, useState } from 'react'

const ChatWidget = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages])

    async function sendMessage() {
        if (!input.trim()) return
        setMessages(prev => [...prev, { sender: "user", text: input }])
        setLoading(true)

        const res = await fetch("http://localhost:3000/chat/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input, sessionId })
        })

        const data = await res.json()

        setMessages(prev => [...prev, { sender: "ai", text: data.reply }])
        setSessionId(data.sessionId)
        setInput('')
        setLoading(false)
    }

    return (
        <div className='chatBox border-2 p-6 rounded-xl h-[50vh]'>
            <div className='flex gap-2'>
                <input
                    type="text"
                    value={input}
                    className='border p-2 rounded-xl '
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder='Enter your message...'
                />
                <button onClick={sendMessage} disabled={loading} >Send</button>
            </div>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={message.sender}>{message.text}</div>
                ))}
                {loading && <div>Agent is typing...</div>}
                <div ref={bottomRef}></div>
            </div>
        </div>

    )
}

export default ChatWidget