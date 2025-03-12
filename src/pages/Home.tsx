import { useSelect } from "~/context"
import { FormattedMessage, useIntl } from "~/i18n"

export function Home() {
	const isMobile = useSelect(state => state.app.mobile)
	return (
		<article tw="flex flex-col gap-5">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-5">What is Lorem Ipsum? {isMobile ? "mobile" : "desktop"}</h1>
				<p tw="mb-7">
					<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
					been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five
					centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
					popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
					Ipsum.
				</p>
			</div>
			<div tw="py-7 flex flex-col gap-7">
				<div tw="max-w-xl">
					<h1 tw="font-bold text-lg mb-4">中文假文產生器</h1>
					<p tw="mb-4">
						本有時候不出的了一下，這篇親卡哈哈戴口罩可能⋯知道是莉的是。類似就是了有弱也想就不，加油ㄉ的力，這兩共很少他不。不意外最愛的動作什，到底是，真天是一樣讓他來才，朋友話說，要不要大概我是就為，人想也只手。
					</p>
					<p tw="mb-4">
						經過，沒有會想⋯來如此要來，真的體的吃東是很聽起可以看：不明不然的快樂網大學生⋯心得我今天。
					</p>
					<p tw="mb-4">
						喜歡的了希望部台灣，也有不好會是困擾這種時也⋯就直接些當我就是是好得很也喜歡，在幹嘛特別知道是那你用下這，他年星期束多人他臨終一次，直接看不是我還沒面就一。
					</p>
					<MyTime />
					<Test1 />
					<Test2 />
				</div>
				<div>
					<a
						href="https://ui.shadcn.com/"
						tw="hover:underline accent-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://ui.shadcn.com/
					</a>
				</div>
			</div>
		</article>
	)
}

function MyTime() {
	const { format, formatDuration } = useIntl(s => s.dateFns)
	return (
		<div tw="whitespace-pre">
			{format(new Date(), "PPPpp")}
			<br />
			{formatDuration(32777)}
		</div>
	)
}

function Test1() {
	return <FormattedMessage id="test" values={{ value: <strong>Eric</strong> }} />
}

function Test2() {
	const intl = useIntl(s => s.intl)
	const data = intl.formatMessage(
		{ id: "test" },
		{
			value: <strong>Eric</strong>,
		},
	)
	return <div>{data}</div>
}
