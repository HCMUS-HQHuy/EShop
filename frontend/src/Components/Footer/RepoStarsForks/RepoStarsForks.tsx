import { useTranslation } from "react-i18next";
import { MY_REPOS_URL, WEBSITE_REPO_ID } from "src/Data/globalVariables.tsx";
import { repoStarsForksToolTipLeftPos } from "src/Functions/tooltipPositions.ts";
import { getDataById } from "src/Functions/helper.ts";
import useAsync from "src/Hooks/Helper/useAsync.tsx";
import SvgIcon from "../../Shared/MiniComponents/SvgIcon.tsx";
import ToolTip from "../../Shared/MiniComponents/ToolTip.tsx";
import s from "./RepoStarsForks.module.scss";

const RepoStarsForks = () => {
  const { t, i18n } = useTranslation();
  const [reposData, isError] = useAsync(MY_REPOS_URL);
  const websiteRepo = getDataById(reposData, WEBSITE_REPO_ID);
  const repoStars = websiteRepo?.stargazers_count;
  const repoForks = websiteRepo?.forks;
  const repoUrl = websiteRepo?.html_url;
  const leftToolTipPos = repoStarsForksToolTipLeftPos(i18n.language);

  return (
    !isError && (
      <a
        href={repoUrl}
        target="_blank"
        className={s.repoStarsForks}
        aria-label="Website's repository"
      >
        <div className={s.wrapper}>
          <SvgIcon name="star" />
          <span className={s.number}>{repoStars}</span>
        </div>

        <div className={s.wrapper}>
          <SvgIcon name="codeFork" />
          <span className={s.number}>{repoForks}</span>
        </div>

        <ToolTip
          bottom="40px"
          left={leftToolTipPos}
          content={t("tooltips.repoStarsForks")}
        />
      </a>
    )
  );
};
export default RepoStarsForks;
