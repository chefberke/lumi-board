"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  workspaces: "Project",
  inbox: "Inbox",
  calendar: "Calendar",
};

interface PathCrumbProps {
  customTitles?: Record<string, string>;
  homeTitle?: string;
  homeUrl?: string;
}

function PathCrumb({
  customTitles = {},
  homeTitle = "Home",
  homeUrl = "/dashboard",
}: PathCrumbProps = {}) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = [];

  breadcrumbItems.push(
    <BreadcrumbItem key="home">
      <BreadcrumbLink asChild>
        <Link href={homeUrl}>{homeTitle}</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );

  // Diğer parçalar için breadcrumb öğeleri
  pathSegments.forEach((segment, index) => {
    const isId = segment.length === 24 && /^[0-9a-f]+$/i.test(segment);

    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    breadcrumbItems.push(<BreadcrumbSeparator key={`sep-${index}`} />);

    let title =
      customTitles[segment] ||
      pathNameMap[segment] ||
      (isId ? "Kanban" : segment.charAt(0).toUpperCase() + segment.slice(1));

    if (index === pathSegments.length - 1) {
      breadcrumbItems.push(
        <BreadcrumbItem key={segment}>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <BreadcrumbItem key={segment}>
          <BreadcrumbLink asChild>
            <Link href={href}>{title}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    }
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}

export default PathCrumb;
