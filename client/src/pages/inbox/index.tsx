import { FaRegEdit } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoSearchSharp } from 'react-icons/io5';
import Messages from '../../components/ui/inbox/Messages';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Link } from 'react-router-dom';

// Define the interfaces for the expected data structure
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Message {
  _id: string;
  text: string;
  createdAt: string;
  seen: boolean;
  msgByUserId: string;
}

interface Conversation {
  _id: string;
  sender?: User;
  receiver?: User;
  lastMsg?: Message;
  unseenMsg?: number;
  updatedAt: string;
}

const InboxPage: React.FC = () => {
  const socketConnection = useAppSelector(
    (state) => state?.user.socketConnection
  );
  const user = useAppSelector((state) => state?.user.user);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message sidebar', user.id);

      socketConnection.on('conversation', (data: Conversation[]) => {
        setConversation(data);
      });
    }
  }, [socketConnection, user]);

  console.log('conversation', conversation);

  return (
    <div className='flex h-[39rem] rounded-md border bg-white shadow-md'>
      <div className='w-[18rem] max-w-[18rem] border-r pr-1 shadow-md'>
        <div className='flex flex-col p-2'>
          <div className='mb-3 flex w-full items-center justify-between'>
            <FaRegEdit
              className='text-lg cursor-pointer text-indigo-600'
              title='New Message'
            />
          </div>

          <div className='relative mb-5'>
            <input
              type='search'
              placeholder='Search Name...'
              className='rounded-md bg-slate-200 py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none sm:w-full'
            />
            <IoSearchSharp className='absolute left-4 top-[8px] text-slate-500' />
          </div>

          {conversation.map((conv) => {
            const otherUser =
              conv.sender?._id === user.id ? conv.receiver : conv.sender;
            const otherUserId = otherUser ? otherUser._id : 'unknown';

            return (
              <Link
                key={conv._id}
                to={`/inbox/m/${otherUserId}`}
                className={`mb-1 flex h-[3.3rem] cursor-pointer items-center rounded-md p-2 ${
                  selectedConversationId === conv._id
                    ? 'bg-indigo-100'
                    : 'hover:bg-indigo-50'
                }`}
                onClick={() => setSelectedConversationId(conv._id)}
              >
                <div className='flex items-center flex-1'>
                  <div className='h-10 w-10 overflow-hidden rounded-full'>
                    <img
                      src='/default-profile.jpg' // Placeholder image
                      height={45}
                      width={45}
                      alt='profile'
                      className='object-cover'
                    />
                  </div>
                  <div className='ml-2 flex h-full items-center justify-between w-full'>
                    <div className='flex flex-col gap-1 flex-1 text-xs'>
                      <p className='max-w-[135px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-slate-800'>
                        {otherUser?.name || 'Unknown User'}
                      </p>
                      <p className='max-w-[135px] overflow-hidden text-ellipsis whitespace-nowrap text-slate-700'>
                        {conv.lastMsg && conv.lastMsg.msgByUserId === user.id
                          ? 'You: '
                          : ''}

                        {conv.lastMsg ? conv.lastMsg.text : 'No messages yet'}
                      </p>
                    </div>
                    <div className='flex flex-col items-end'>
                      <p
                        className={`text-[10px] whitespace-nowrap ${
                          conv.lastMsg && conv.lastMsg.seen
                            ? 'text-slate-700'
                            : 'text-indigo-700'
                        }`}
                      >
                        {conv.lastMsg
                          ? new Date(conv.lastMsg.createdAt).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' }
                            )
                          : ''}
                      </p>
                      {conv.unseenMsg && conv.unseenMsg > 0 ? (
                        <GoDotFill className='text-indigo-700' />
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Messages />
    </div>
  );
};

export default InboxPage;
