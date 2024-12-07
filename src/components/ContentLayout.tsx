import AppHeader from "./Header/AppHeader";

interface ContentLayoutProps {
  home: string;
  mainpage?: string;
  childpage? : string;
  childrenpage? : string;
  children: React.ReactNode;
}

export function ContentLayout({ home, mainpage, childpage, childrenpage, children }: ContentLayoutProps) {
  return (
    <div className="h-max-h-screen">
      <AppHeader home={home} mainpage={mainpage} childpage={childpage} childrenpage={childrenpage}/>
      <div>{children}</div>
    </div>
  );
}
