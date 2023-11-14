import { Button, buttonVariants } from "@components/button"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { NavLink } from "react-router-dom"
import { tw } from "twobj"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./sheet"

const navlink = tw`justify-start text-muted-foreground hover:bg-muted [&.active]:(bg-accent text-foreground font-medium)`

const StyledNavLink = tw(NavLink)(buttonVariants({ variant: "link" }), navlink)

enum NavItemKind {
	Link,
}

interface NavItemLinkType {
	kind: NavItemKind.Link
	label: React.ReactElement | string
	pathname: string
	hidden?: true
}

type NavItemType = NavItemLinkType

const navs: NavItemType[] = [
	{
		kind: NavItemKind.Link,
		pathname: "",
		label: "Home",
	},
	{
		kind: NavItemKind.Link,
		pathname: "table",
		label: "Table",
	},
	{
		kind: NavItemKind.Link,
		pathname: "test",
		label: "Test",
	},
	{
		kind: NavItemKind.Link,
		pathname: "components",
		label: "Components",
	},
	{
		kind: NavItemKind.Link,
		pathname: "login",
		label: "Login",
	},
]

function NavItemLink({ label, pathname }: NavItemLinkType) {
	return (
		<StyledNavLink to={pathname} className="group" end={pathname === "/"}>
			{label}
		</StyledNavLink>
	)
}

function NavItem(props: NavItemType) {
	switch (props.kind) {
		case NavItemKind.Link:
			return <NavItemLink {...props} />
	}
	return null
}

export function LeftNavigationMenu() {
	return (
		<aside
			tw="hidden md:flex flex-col fixed top-[calc(3.5rem + 1px)] md:sticky
				h-[calc(100vh - 3.5rem - 1px)] bg-card"
		>
			<nav tw="relative p-4 overflow-auto grow transition flex flex-col gap-1">
				{navs.map((item, i) => !item.hidden && <NavItem key={i} {...item} />)}
			</nav>
		</aside>
	)
}

const StyledSheetNavLink = tw(NavLink)(buttonVariants({ variant: "link" }))

function SheetNavItemLink({ label, pathname, ...props }: NavItemLinkType) {
	return (
		<StyledSheetNavLink to={pathname} className="group" end={pathname === "/"} {...props}>
			{label}
		</StyledSheetNavLink>
	)
}

function SheetNavItem(props: NavItemType) {
	switch (props.kind) {
		case NavItemKind.Link:
			return (
				<SheetClose>
					<SheetNavItemLink {...props} />
				</SheetClose>
			)
	}
	return null
}

export function NavigationSheetMenu() {
	return (
		<Sheet>
			<SheetTrigger>
				<Button
					size="icon"
					variant="ghost"
					tw="rounded-none inline-flex md:hidden [-webkit-tap-highlight-color: transparent]"
				>
					<HamburgerMenuIcon />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<nav tw="relative p-4 overflow-auto grow transition flex flex-col gap-1">
					{navs.map((item, i) => !item.hidden && <SheetNavItem key={i} {...item} />)}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
