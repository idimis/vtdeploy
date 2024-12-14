import React from "react";

interface EventSearchProps {
  searchQuery: string;
  filteredEvents: { id: number; title: string }[];
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEventSelect: (eventTitle: string) => void;
}

const EventSearch: React.FC<EventSearchProps> = ({
  searchQuery,
  filteredEvents,
  onSearchQueryChange,
  onEventSelect,
}) => (
  <div className="relative hidden md:flex items-center border border-gray-300 rounded-full px-3 py-1">
    <input
      type="text"
      placeholder="Search for events..."
      className="outline-none text-sm px-2 py-1 w-60"
      value={searchQuery}
      onChange={onSearchQueryChange}
    />
    {filteredEvents.length > 0 && (
      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-60 mt-2 shadow-lg max-h-64 overflow-y-auto">
        <ul>
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onEventSelect(event.title)}
            >
              {event.title}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default EventSearch;
