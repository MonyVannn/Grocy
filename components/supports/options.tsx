import { MotionConfig, motion } from "framer-motion";

const Testimonial = ({
  imgSrc,
  name,
  title,
  company,
  content,
}: {
  imgSrc: string;
  name: string;
  title: string;
  company: string;
  content: string;
}) => (
  <MotionConfig
    transition={{
      duration: 0.2,
      ease: "easeInOut",
    }}
  >
    <motion.div
      initial={{
        y: 0,
      }}
      animate={{
        y: -8,
      }}
      exit={{
        y: 0,
      }}
      className="w-full overflow-hidden rounded-lg border-2 border-zinc-900 bg-white p-8 md:p-12"
    >
      <div className="mb-6 flex items-center gap-6">
        <div className="rounded-lg bg-zinc-900">
          <motion.img
            initial={{
              rotate: "0deg",
              opacity: 0,
            }}
            animate={{
              rotate: "3deg",
              opacity: 1,
            }}
            exit={{
              rotate: "0deg",
              opacity: 0,
            }}
            src={imgSrc}
            alt="avatar"
            className="size-24 rounded-lg border-2 border-zinc-900 bg-indigo-200"
          />
        </div>
        <motion.div
          initial={{
            y: 12,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -12,
            opacity: 0,
          }}
        >
          <span className="mb-1.5 block text-3xl font-medium">{name}</span>
          <span className="text-zinc-600">
            {title} – <span className="text-indigo-600">{company}</span>
          </span>
        </motion.div>
      </div>
      <motion.p
        initial={{
          y: 12,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: -12,
          opacity: 0,
        }}
        className="text-xl leading-relaxed"
      >
        {content}
      </motion.p>
    </motion.div>
  </MotionConfig>
);

export const OPTIONS = [
  {
    title: "Families",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Family"
        name="Sarah L."
        title="Mom"
        company="Family of Four"
        content="Grocy has transformed how we manage our groceries! Now, everyone in the family knows what we need, and we can easily split the costs."
      />
    ),
  },
  {
    title: "Roommates",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Roommate"
        name="Mike T."
        title="Student"
        company="College Apartment"
        content="As a college student, Grocy helps me and my roommates keep track of our shared groceries and expenses. It's made cooking together so much easier!"
      />
    ),
  },
  {
    title: "Friends",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Friends"
        name="Emily R."
        title="Event Organizer"
        company="Weekend Gatherings"
        content="Grocy is perfect for our friend group! We can plan meals, share grocery costs, and ensure everyone contributes fairly."
      />
    ),
  },
  {
    title: "Chefs",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Chef"
        name="Carlos M."
        title="Home Chef"
        company="Culinary Enthusiast"
        content="I love using Grocy to manage my ingredients and track expenses for my cooking projects. It keeps everything organized!"
      />
    ),
  },
  {
    title: "Budget-Conscious Shoppers",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Budget"
        name="Linda K."
        title="Financial Advisor"
        company="Smart Spending"
        content="Grocy helps me keep my grocery budget in check. I can see where my money goes and make adjustments as needed."
      />
    ),
  },
  {
    title: "Meal Planners",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=MealPlanner"
        name="Tom H."
        title="Nutritionist"
        company="Healthy Living"
        content="With Grocy, I can plan meals for the week and ensure I have all the ingredients on hand. It’s a game changer for healthy eating!"
      />
    ),
  },
  {
    title: "Event Hosts",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Event"
        name="Jessica P."
        title="Party Planner"
        company="Social Gatherings"
        content="Grocy makes it easy to manage groceries for events. I can track who brings what and keep costs organized!"
      />
    ),
  },
  {
    title: "Community Groups",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Community"
        name="David W."
        title="Community Organizer"
        company="Local Events"
        content="Using Grocy for our community potlucks has been fantastic! Everyone can see what’s needed and contribute accordingly."
      />
    ),
  },
  {
    title: "Local Businesses",
    Content: () => (
      <Testimonial
        imgSrc="https://api.dicebear.com/8.x/notionists/svg?seed=Business"
        name="Joanne F."
        title="Business Owner"
        company="The Local Company"
        content="Grocy helps us manage our team lunches and shared supplies efficiently. It’s a great tool for any small business!"
      />
    ),
  },
];
