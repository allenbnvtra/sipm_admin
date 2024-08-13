import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import { IoIosSearch, IoMdMore } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { useAppSelector } from '../../../redux/hooks';
import { useParams } from 'react-router-dom';

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

interface MessageType {
  text: string;
  msgByUserId: string;
  createdAt: string;
}

interface GroupedMessages {
  date: string;
  messages: MessageType[];
}

const Messages = () => {
  const socketConnection = useAppSelector(
    (state) => state?.user.socketConnection
  );
  const user = useAppSelector((state) => state?.user.user);
  const params = useParams<{ userId?: string }>();

  const [dataUser, setDataUser] = useState({
    name: '',
    email: '',
    online: false,
    _id: '',
  });
  const [message, setMessage] = useState<MessageType>({
    text: '',
    msgByUserId: '',
    createdAt: '',
  });
  const [allMessage, setAllMessage] = useState<MessageType[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection && params.userId) {
      socketConnection.emit('message-page', params.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (messages: MessageType[]) => {
        setAllMessage(messages);
      });

      socketConnection.emit('get messages', {
        sender: user.id,
        receiver: params.userId,
      });

      socketConnection.on('show messages', (messages: MessageType[]) => {
        setAllMessage(messages);
      });
    }
  }, [socketConnection, params.userId, user.id]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage((prev) => ({ ...prev, text: value }));
  };

  const handleSendMessage = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.text && params.userId) {
      if (socketConnection) {
        socketConnection.emit('send message', {
          sender: user.id,
          receiver: params.userId,
          text: message.text,
          msgByUserId: user.id,
        });
        setMessage({
          text: '',
          msgByUserId: '',
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  const groupMessagesByTime = (messages: MessageType[]) => {
    const grouped: GroupedMessages[] = [];
    const timeThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (messages.length === 0) return grouped;

    messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let currentGroup: GroupedMessages = {
      date: formatDate(new Date(messages[0].createdAt)),
      messages: [messages[0]],
    };

    for (let i = 1; i < messages.length; i++) {
      const prevMessageDate = new Date(messages[i - 1].createdAt).getTime();
      const currentMessageDate = new Date(messages[i].createdAt).getTime();

      if (currentMessageDate - prevMessageDate > timeThreshold) {
        grouped.push(currentGroup);
        currentGroup = {
          date: formatDate(new Date(messages[i].createdAt)),
          messages: [messages[i]],
        };
      } else {
        currentGroup.messages.push(messages[i]);
      }
    }
    grouped.push(currentGroup);

    return grouped;
  };

  const groupedMessages = groupMessagesByTime(allMessage);

  return (
    <div className='w-full flex flex-col h-full'>
      {params.userId ? (
        <>
          <div className='flex items-center justify-between border-b p-3 shadow-sm'>
            <div className='flex'>
              <div className='h-8 w-8 overflow-hidden rounded-full'>
                <img
                  src='/default-profile.jpg'
                  height={38}
                  width={38}
                  alt='profile'
                  className='object-cover'
                />
              </div>
              <div className='ml-2'>
                <p className='text-sm font-light text-slate-800'>
                  {dataUser.name}
                </p>
                {dataUser.online ? (
                  <p className='flex items-center text-xs font-light text-slate-600'>
                    <GoDotFill className='text-green-700' />
                    online
                  </p>
                ) : (
                  <p className='flex items-center text-xs font-light text-slate-600'>
                    <GoDotFill className='text-red-600' />
                    offline
                  </p>
                )}
              </div>
            </div>
            <div className='flex gap-1 text-xl'>
              <IoIosSearch className='cursor-pointer' />
              <IoMdMore className='cursor-pointer' />
            </div>
          </div>

          <div
            className='flex flex-col flex-1 p-3 space-y-2 overflow-y-auto bg-[#f7f7f7]'
            ref={messagesContainerRef}
          >
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                <p className='text-xs text-slate-700 text-center mb-2'>
                  {group.date}
                </p>
                {group.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.msgByUserId === user.id ? 'justify-end' : ''
                    }`}
                  >
                    <div
                      className={`${
                        msg.msgByUserId !== user.id
                          ? 'bg-white text-slate-800 border-slate-200'
                          : 'bg-blue-600 text-white border-blue-600'
                      } border shadow-sm rounded-2xl px-3 py-2 text-sm mb-2 max-w-[16rem]`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <form
            className='h-[4rem] flex gap-3 items-center p-3 border-t shadow-lg'
            onSubmit={handleSendMessage}
          >
            <input
              type='text'
              placeholder='Type your message...'
              className='flex-1 py-2 px-4 border border-slate-200 shadow-md rounded-2xl text-sm text-slate-800 focus:outline-none'
              onChange={handleOnChange}
              value={message.text}
            />
            <button className='rounded-full cursor-pointer hover:bg-slate-100 transition-all p-2 flex justify-center'>
              <IoSend size={21} />
            </button>
          </form>
        </>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-lg text-gray-600'>
            Welcome! Select a conversation to start chatting.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
