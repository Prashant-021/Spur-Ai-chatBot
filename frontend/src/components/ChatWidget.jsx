import React, { useEffect, useRef, useState } from 'react'

const ChatWidget = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages])

    async function sendMessage() {
        if (!input.trim()) return
        setMessages(prev => [...prev, { sender: "user", text: input }])
        setLoading(true)

        const res = await fetch(`${import.meta.env}/chat/message}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input, sessionId })
        })

        const data = await res.json()

        setMessages(prev => [...prev, { sender: "ai", text: data.reply }])
        setSessionId(data.sessionId)
        localStorage.setItem("sessionId", data.sessionId);
        setInput('')
        setLoading(false)
    }
    useEffect(() => {
        if (!sessionId) return;

        fetch(`${import.meta.env}/chat/history/${sessionId}`)
            .then(res => res.json())
            .then(data => setMessages(data.messages));
    }, [sessionId]);

    return (
        <div className='chatBox border-2  rounded-xl h-[80vh] w-full md:w-[800px] m-auto flex flex-col overflow-y-scroll'>
            <div className="messages rounded-xl p-3 h-auto grow flex items-end flex-col justify-end">
                {messages.map((message, index) => (
                    <div key={index} className={`${message.sender} flex flex-col w-full ${message.sender === 'ai' ? 'items-start' : 'items-end '}  `}>
                        <p className={`font-bold w-fit text-white ${message.sender === 'ai' ? 'text-left ' : 'text-right '}`}>{message.sender === 'ai' ? 'Agent' : 'You'}</p>
                        <div className={`w-fit ${message.sender} ${message.sender === 'ai' ? 'text-left bg-[#18252c]' : 'text-right bg-[#0a0a0a]'} mb-3 p-3 rounded-xl `}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {loading && <div>Agent is typing...</div>}
                <div ref={bottomRef}></div>
            </div>

            <div className='flex gap-2 sticky p-3 bottom-0 bg-black items-end'>
                <div className='text-left grow'>
                    <p className={input.length > 1000 ? "text-red-500" : "text-gray-400"}>
                        {input.length}/1000
                    </p>
                    <textarea
                        type="text"
                        value={input}
                        className='border p-2 w-full rounded-xl '
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder='Enter your message...'
                        rows={4}
                    />
                </div>
                <button
                    className='h-fit '
                    onClick={sendMessage}
                    disabled={
                        loading ||
                        !input.trim() ||
                        input.length > 1000}
                >Send</button>
            </div>
        </div>

    )
}

export default ChatWidget