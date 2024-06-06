import { Button } from "@components/button"
import { CandidateInput } from "@components/candidate-input"
import { Command, CommandItem, CommandList } from "@components/command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@components/popover"
import { animated, easings, useSprings } from "@react-spring/web"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useDrag } from "@use-gesture/react"
import { HTMLAttributes, createContext, startTransition, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { TodoList } from "./Todolist"

function DragExample() {
	const [springs, springApi] = useSprings(1, () => ({
		x: 0,
		y: 0,
		config: { duration: 250, easing: easings.easeOutExpo },
	}))

	// Set the drag hook and define component movement based on gesture data.
	const [dragging, setDragging] = useState(false)

	const gestures = useDrag(({ down, movement: [_mx, my] }) => {
		let y = my
		if (!down || y < 0) {
			y = 0
		} else if (y > 300) {
			y = 300
		}
		setDragging(down)
		springApi.start({ y })
	})

	// Bind it to a component.
	return springs.map((style, i) => (
		<AnimatedItem
			key={i}
			style={{ ...style, cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
			{...gestures()}
		>
			<div tw="p-3 select-none text-primary-foreground">Content</div>
		</AnimatedItem>
	))
}

function AnimatedItem({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<animated.div tw="bg-primary" {...props}>
			{children}
		</animated.div>
	)
}

export function Test() {
	return (
		<article tw="relative">
			<h1 tw="border-b mb-4">Test</h1>
			<CandidateForm />
			<div tw="bg-accent/50 p-2 max-w-[600px] flex gap-5 justify-end">
				<Button variant="outline" tw="flex-1 sm:max-w-[130px]">
					Cancel
				</Button>
				<Button variant="outline" tw="flex-1 sm:max-w-[130px]">
					Submit
				</Button>
			</div>
			<div tw="relative p-4">
				<DragExample />
			</div>
			<SelectList />
			<div tw="max-w-lg">
				<TodoList />
			</div>

			<Demo />
		</article>
	)
}

function CandidateForm() {
	const methods = useForm<{ value: string }>()
	return (
		<form
			onSubmit={methods.handleSubmit(data => {
				console.log(data)
			})}
		>
			<CandidateInput
				candidates={["aaa", "bbb", "ccc"]}
				onSelect={value => {
					methods.setValue("value", value)
				}}
				{...methods.register("value")}
			/>
		</form>
	)
}

interface BearState {
	bears: number
	increase: (by: number) => void
}

import { commandScore } from "@components/command-score"
import { SearchInput } from "@components/input"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type Store = ReturnType<typeof createStore>

function createStore() {
	return create<BearState>()(
		immer(set => ({
			bears: 0,
			increase(by) {
				set(state => {
					state.bears += by
				})
			},
		})),
	)
}

const StoreContext = createContext<Store>(null as unknown as Store)

function StoreProvider({ children }) {
	const storeRef = useRef<Store>()
	if (!storeRef.current) {
		storeRef.current = createStore()
	}
	return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
}

function Demo() {
	return (
		<>
			<StoreProvider>
				<DemoBox></DemoBox>
			</StoreProvider>
			<StoreProvider>
				<DemoBox></DemoBox>
			</StoreProvider>
		</>
	)
}

function DemoBox() {
	const useStore = useContext(StoreContext)
	const bears = useStore(state => state.bears)
	const increase = useStore(state => state.increase)
	return <div onClick={() => increase(1)}>{bears}</div>
}

function SelectList() {
	const [value, setValue] = useState("Africa/Abidjan")
	const [visible, setVisible] = useState(false)

	const parentRef = useRef<HTMLDivElement>(null)

	const [searchInput, setSearchInput] = useState("")

	const filteredSuggestion = useMemo(() => {
		if (!searchInput) {
			return suggestion
		}
		interface Result {
			score: number
			value: (typeof suggestion)[0]
		}

		const ans = suggestion
			.map<Result>(value => ({ score: commandScore(value, searchInput, []), value }))
			.filter(value => value.score > 0)

		ans.sort((a, b) => {
			return b.score - a.score
		})

		return ans.map(s => s.value)
	}, [searchInput])

	useEffect(() => {
		if (!visible) {
			setSearchInput("")
		}
	}, [visible])

	const rowVirtualizer = useVirtualizer({
		count: filteredSuggestion.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 32,
		overscan: 30,
	})

	return (
		<Popover placement="bottom-start" visible={visible} setVisible={setVisible}>
			<PopoverTrigger>
				<Button variant="outline">{value}</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div>
					<Command>
						<SearchInput
							tw="focus-within:ring-0 border-0 border-b rounded-b-none"
							onChange={e => {
								const value = e.target.value
								startTransition(() => setSearchInput(value))
							}}
							autoFocus
						/>
						<PopoverClose>
							<CommandList tw="max-h-[320px] w-[250px]" ref={parentRef}>
								<div tw="relative w-full" css={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
									{rowVirtualizer.getVirtualItems().map(({ key, index, size, start }) => {
										const data = filteredSuggestion[index]
										return (
											<CommandItem
												key={key}
												tw="absolute top-0 left-0 w-full"
												css={{ height: `${size}px`, transform: `translateY(${start}px)` }}
												onSelect={() => {
													setValue(data)
													setVisible(false)
												}}
											>
												{data}
											</CommandItem>
										)
									})}
									{/* {suggestion.map((v, i) => (
									<CommandItem
										key={i}
										onSelect={() => {
											setValue(v)
											setVisible(false)
										}}
									>
										{v}
									</CommandItem>
								))} */}
								</div>
							</CommandList>
						</PopoverClose>
					</Command>
				</div>
			</PopoverContent>
		</Popover>
	)
}

const suggestion = [
	"Africa/Abidjan",
	"Africa/Accra",
	"Africa/Algiers",
	"Africa/Bissau",
	"Africa/Cairo",
	"Africa/Casablanca",
	"Africa/Ceuta",
	"Africa/El Aaiun",
	"Africa/Johannesburg",
	"Africa/Juba",
	"Africa/Khartoum",
	"Africa/Lagos",
	"Africa/Maputo",
	"Africa/Monrovia",
	"Africa/Nairobi",
	"Africa/Ndjamena",
	"Africa/Sao Tome",
	"Africa/Tripoli",
	"Africa/Tunis",
	"Africa/Windhoek",
	"America/Adak",
	"America/Anchorage",
	"America/Araguaina",
	"America/Argentina/Buenos Aires",
	"America/Argentina/Catamarca",
	"America/Argentina/Cordoba",
	"America/Argentina/Jujuy",
	"America/Argentina/La Rioja",
	"America/Argentina/Mendoza",
	"America/Argentina/Rio Gallegos",
	"America/Argentina/Salta",
	"America/Argentina/San Juan",
	"America/Argentina/San Luis",
	"America/Argentina/Tucuman",
	"America/Argentina/Ushuaia",
	"America/Asuncion",
	"America/Atikokan",
	"America/Bahia",
	"America/Bahia Banderas",
	"America/Barbados",
	"America/Belem",
	"America/Belize",
	"America/Blanc-Sablon",
	"America/Boa Vista",
	"America/Bogota",
	"America/Boise",
	"America/Cambridge Bay",
	"America/Campo Grande",
	"America/Cancun",
	"America/Caracas",
	"America/Cayenne",
	"America/Chicago",
	"America/Chihuahua",
	"America/Costa Rica",
	"America/Creston",
	"America/Cuiaba",
	"America/Curacao",
	"America/Danmarkshavn",
	"America/Dawson",
	"America/Dawson Creek",
	"America/Denver",
	"America/Detroit",
	"America/Edmonton",
	"America/Eirunepe",
	"America/El Salvador",
	"America/Fort Nelson",
	"America/Fortaleza",
	"America/Glace Bay",
	"America/Goose Bay",
	"America/Grand Turk",
	"America/Guatemala",
	"America/Guayaquil",
	"America/Guyana",
	"America/Halifax",
	"America/Havana",
	"America/Hermosillo",
	"America/Indiana/Indianapolis",
	"America/Indiana/Knox",
	"America/Indiana/Marengo",
	"America/Indiana/Petersburg",
	"America/Indiana/Tell City",
	"America/Indiana/Vevay",
	"America/Indiana/Vincennes",
	"America/Indiana/Winamac",
	"America/Inuvik",
	"America/Iqaluit",
	"America/Jamaica",
	"America/Juneau",
	"America/Kentucky/Louisville",
	"America/Kentucky/Monticello",
	"America/La Paz",
	"America/Lima",
	"America/Los Angeles",
	"America/Maceio",
	"America/Managua",
	"America/Manaus",
	"America/Martinique",
	"America/Matamoros",
	"America/Mazatlan",
	"America/Menominee",
	"America/Merida",
	"America/Metlakatla",
	"America/Mexico City",
	"America/Miquelon",
	"America/Moncton",
	"America/Monterrey",
	"America/Montevideo",
	"America/Nassau",
	"America/New York",
	"America/Nipigon",
	"America/Nome",
	"America/Noronha",
	"America/North Dakota/Beulah",
	"America/North Dakota/Center",
	"America/North Dakota/New Salem",
	"America/Nuuk",
	"America/Ojinaga",
	"America/Panama",
	"America/Pangnirtung",
	"America/Paramaribo",
	"America/Phoenix",
	"America/Port-au-Prince",
	"America/Port of Spain",
	"America/Porto Velho",
	"America/Puerto Rico",
	"America/Punta Arenas",
	"America/Rainy River",
	"America/Rankin Inlet",
	"America/Recife",
	"America/Regina",
	"America/Resolute",
	"America/Rio Branco",
	"America/Santarem",
	"America/Santiago",
	"America/Santo Domingo",
	"America/Sao Paulo",
	"America/Scoresbysund",
	"America/Sitka",
	"America/St Johns",
	"America/Swift Current",
	"America/Tegucigalpa",
	"America/Thule",
	"America/Thunder Bay",
	"America/Tijuana",
	"America/Toronto",
	"America/Vancouver",
	"America/Whitehorse",
	"America/Winnipeg",
	"America/Yakutat",
	"America/Yellowknife",
	"Antarctica/Casey",
	"Antarctica/Davis",
	"Antarctica/DumontDUrville",
	"Antarctica/Macquarie",
	"Antarctica/Mawson",
	"Antarctica/Palmer",
	"Antarctica/Rothera",
	"Antarctica/Syowa",
	"Antarctica/Troll",
	"Antarctica/Vostok",
	"Asia/Almaty",
	"Asia/Amman",
	"Asia/Anadyr",
	"Asia/Aqtau",
	"Asia/Aqtobe",
	"Asia/Ashgabat",
	"Asia/Atyrau",
	"Asia/Baghdad",
	"Asia/Baku",
	"Asia/Bangkok",
	"Asia/Barnaul",
	"Asia/Beirut",
	"Asia/Bishkek",
	"Asia/Brunei",
	"Asia/Chita",
	"Asia/Choibalsan",
	"Asia/Colombo",
	"Asia/Damascus",
	"Asia/Dhaka",
	"Asia/Dili",
	"Asia/Dubai",
	"Asia/Dushanbe",
	"Asia/Famagusta",
	"Asia/Gaza",
	"Asia/Hebron",
	"Asia/Ho Chi Minh",
	"Asia/Hong Kong",
	"Asia/Hovd",
	"Asia/Irkutsk",
	"Asia/Jakarta",
	"Asia/Jayapura",
	"Asia/Jerusalem",
	"Asia/Kabul",
	"Asia/Kamchatka",
	"Asia/Karachi",
	"Asia/Kathmandu",
	"Asia/Khandyga",
	"Asia/Kolkata",
	"Asia/Krasnoyarsk",
	"Asia/Kuala Lumpur",
	"Asia/Kuching",
	"Asia/Macau",
	"Asia/Magadan",
	"Asia/Makassar",
	"Asia/Manila",
	"Asia/Nicosia",
	"Asia/Novokuznetsk",
	"Asia/Novosibirsk",
	"Asia/Omsk",
	"Asia/Oral",
	"Asia/Pontianak",
	"Asia/Pyongyang",
	"Asia/Qatar",
	"Asia/Qostanay",
	"Asia/Qyzylorda",
	"Asia/Riyadh",
	"Asia/Sakhalin",
	"Asia/Samarkand",
	"Asia/Seoul",
	"Asia/Shanghai",
	"Asia/Singapore",
	"Asia/Srednekolymsk",
	"Asia/Taipei",
	"Asia/Tashkent",
	"Asia/Tbilisi",
	"Asia/Tehran",
	"Asia/Thimphu",
	"Asia/Tokyo",
	"Asia/Tomsk",
	"Asia/Ulaanbaatar",
	"Asia/Urumqi",
	"Asia/Ust-Nera",
	"Asia/Vladivostok",
	"Asia/Yakutsk",
	"Asia/Yangon",
	"Asia/Yekaterinburg",
	"Asia/Yerevan",
	"Atlantic/Azores",
	"Atlantic/Bermuda",
	"Atlantic/Canary",
	"Atlantic/Cape Verde",
	"Atlantic/Faroe",
	"Atlantic/Madeira",
	"Atlantic/Reykjavik",
	"Atlantic/South Georgia",
	"Atlantic/Stanley",
	"Australia/Adelaide",
	"Australia/Brisbane",
	"Australia/Broken Hill",
	"Australia/Currie",
	"Australia/Darwin",
	"Australia/Eucla",
	"Australia/Hobart",
	"Australia/Lindeman",
	"Australia/Lord Howe",
	"Australia/Melbourne",
	"Australia/Perth",
	"Australia/Sydney",
	"Europe/Amsterdam",
	"Europe/Andorra",
	"Europe/Astrakhan",
	"Europe/Athens",
	"Europe/Belgrade",
	"Europe/Berlin",
	"Europe/Brussels",
	"Europe/Bucharest",
	"Europe/Budapest",
	"Europe/Chisinau",
	"Europe/Copenhagen",
	"Europe/Dublin",
	"Europe/Gibraltar",
	"Europe/Helsinki",
	"Europe/Istanbul",
	"Europe/Kaliningrad",
	"Europe/Kiev",
	"Europe/Kirov",
	"Europe/Lisbon",
	"Europe/London",
	"Europe/Luxembourg",
	"Europe/Madrid",
	"Europe/Malta",
	"Europe/Minsk",
	"Europe/Monaco",
	"Europe/Moscow",
	"Europe/Oslo",
	"Europe/Paris",
	"Europe/Prague",
	"Europe/Riga",
	"Europe/Rome",
	"Europe/Samara",
	"Europe/Saratov",
	"Europe/Simferopol",
	"Europe/Sofia",
	"Europe/Stockholm",
	"Europe/Tallinn",
	"Europe/Tirane",
	"Europe/Ulyanovsk",
	"Europe/Uzhgorod",
	"Europe/Vienna",
	"Europe/Vilnius",
	"Europe/Volgograd",
	"Europe/Warsaw",
	"Europe/Zaporozhye",
	"Europe/Zurich",
	"Indian/Chagos",
	"Indian/Christmas",
	"Indian/Cocos",
	"Indian/Kerguelen",
	"Indian/Mahe",
	"Indian/Maldives",
	"Indian/Mauritius",
	"Indian/Reunion",
	"Pacific/Apia",
	"Pacific/Auckland",
	"Pacific/Bougainville",
	"Pacific/Chatham",
	"Pacific/Chuuk",
	"Pacific/Easter",
	"Pacific/Efate",
	"Pacific/Enderbury",
	"Pacific/Fakaofo",
	"Pacific/Fiji",
	"Pacific/Funafuti",
	"Pacific/Galapagos",
	"Pacific/Gambier",
	"Pacific/Guadalcanal",
	"Pacific/Guam",
	"Pacific/Honolulu",
	"Pacific/Kiritimati",
	"Pacific/Kosrae",
	"Pacific/Kwajalein",
	"Pacific/Majuro",
	"Pacific/Marquesas",
	"Pacific/Nauru",
	"Pacific/Niue",
	"Pacific/Norfolk",
	"Pacific/Noumea",
	"Pacific/Pago Pago",
	"Pacific/Palau",
	"Pacific/Pitcairn",
	"Pacific/Pohnpei",
	"Pacific/Port Moresby",
	"Pacific/Rarotonga",
	"Pacific/Tahiti",
	"Pacific/Tarawa",
	"Pacific/Tongatapu",
	"Pacific/Wake",
	"Pacific/Wallis",
	"UTC",
]
