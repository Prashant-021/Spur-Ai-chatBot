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
        <div className='chatBox border-2  rounded-xl h-[80vh] w-full md:w-96 m-auto flex flex-col overflow-y-scroll'>
            <div className="messages rounded-xl p-3 h-auto grow flex items-end flex-col justify-end">
                {messages.map((message, index) => (
                    <div key={index} className={`${message.sender} `}>
                        <p className={`font-bold text-white ${message.sender === 'ai' ? 'text-left ' : 'text-right '}`}>{message.sender === 'ai' ? 'Agent' : 'You'}</p>
                        <div className={`${message.sender} ${message.sender === 'ai' ? 'text-left bg-[#18252c]' : 'text-right bg-[#0a0a0a]'} mb-3 p-3 rounded-xl `}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {loading && <div>Agent is typing...</div>}
                <div ref={bottomRef}></div>
            </div>
            <div className='flex gap-2 sticky p-3 bottom-0 bg-black'>
                <input
                    type="text"
                    value={input}
                    className='border p-2 rounded-xl grow'
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder='Enter your message...'
                />
                <button onClick={sendMessage} disabled={loading} >Send</button>
            </div>
        </div>

    )
}

export default ChatWidget